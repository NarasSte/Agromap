import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Fazenda } from '../../entities/fazenda.entity';
import { Infraestrutura } from '../../entities/infraestrutura.entity';
import { FazendaInfraestrutura } from '../../entities/fazenda-infraestrutura.entity';
import { CreateFazendaDto } from './dto/create-fazenda.dto';
import { UpdateFazendaDto } from './dto/update-fazenda.dto';

@Injectable()
export class FazendaService {
  constructor(
    @InjectRepository(Fazenda)
    private readonly fazendaRepository: Repository<Fazenda>,
    @InjectRepository(Infraestrutura)
    private readonly infraestruturaRepository: Repository<Infraestrutura>,
    @InjectRepository(FazendaInfraestrutura)
    private readonly fazendaInfraestruturaRepository: Repository<FazendaInfraestrutura>,
  ) {}

  private async syncInfraestruturas(fazendaId: number, codigos: string[]): Promise<void> {
    await this.fazendaInfraestruturaRepository.delete({ fazenda_id: fazendaId });
    if (!codigos.length) return;
    const infraestruturas = await this.infraestruturaRepository.find({
      where: { codigo: In(codigos) },
    });
    const vinculos = infraestruturas.map((infra) =>
      this.fazendaInfraestruturaRepository.create({
        fazenda_id: fazendaId,
        infraestrutura_id: infra.id,
      }),
    );
    await this.fazendaInfraestruturaRepository.save(vinculos);
  }

  async create(createFazendaDto: CreateFazendaDto): Promise<Fazenda> {
    const { infraestruturas, ...data } = createFazendaDto;
    const fazenda = await this.fazendaRepository.save(this.fazendaRepository.create(data));
    if (infraestruturas?.length) {
      await this.syncInfraestruturas(fazenda.id, infraestruturas);
    }
    return this.findOne(fazenda.id);
  }

  async findAll(): Promise<Fazenda[]> {
    return await this.fazendaRepository.find({
      relations: { infraestruturas: { infraestrutura: true } },
    });
  }

  async findOne(id: number): Promise<Fazenda> {
    const fazenda = await this.fazendaRepository.findOne({
      where: { id },
      relations: { infraestruturas: { infraestrutura: true } },
    });
    if (!fazenda) {
      throw new NotFoundException(`Fazenda with ID ${id} not found`);
    }
    return fazenda;
  }

  async update(id: number, updateFazendaDto: UpdateFazendaDto): Promise<Fazenda> {
    const { infraestruturas, ...data } = updateFazendaDto;
    const fazenda = await this.findOne(id);
    this.fazendaRepository.merge(fazenda, data);
    await this.fazendaRepository.save(fazenda);
    if (infraestruturas !== undefined) {
      await this.syncInfraestruturas(id, infraestruturas);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const fazenda = await this.findOne(id);
    await this.fazendaRepository.remove(fazenda);
  }
}
