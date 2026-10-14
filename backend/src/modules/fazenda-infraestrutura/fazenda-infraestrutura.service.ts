import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FazendaInfraestrutura } from '../../entities/fazenda-infraestrutura.entity';
import { CreateFazendaInfraestruturaDto } from './dto/create-fazenda-infraestrutura.dto';

@Injectable()
export class FazendaInfraestruturaService {
  constructor(
    @InjectRepository(FazendaInfraestrutura)
    private readonly fazendaInfraestruturaRepository: Repository<FazendaInfraestrutura>,
  ) {}

  async create(createFazendaInfraestruturaDto: CreateFazendaInfraestruturaDto): Promise<FazendaInfraestrutura> {
    const fazendaInfraestrutura = this.fazendaInfraestruturaRepository.create(createFazendaInfraestruturaDto);
    return await this.fazendaInfraestruturaRepository.save(fazendaInfraestrutura);
  }

  async findAll(): Promise<FazendaInfraestrutura[]> {
    return await this.fazendaInfraestruturaRepository.find({ relations: ['fazenda', 'infraestrutura'] });
  }

  async findOne(fazendaId: number, infraestruturaId: number): Promise<FazendaInfraestrutura> {
    const fazendaInfraestrutura = await this.fazendaInfraestruturaRepository.findOne({
      where: { fazenda_id: fazendaId, infraestrutura_id: infraestruturaId },
      relations: ['fazenda', 'infraestrutura'],
    });
    if (!fazendaInfraestrutura) {
      throw new NotFoundException(`FazendaInfraestrutura with fazenda_id ${fazendaId} and infraestrutura_id ${infraestruturaId} not found`);
    }
    return fazendaInfraestrutura;
  }

  async remove(fazendaId: number, infraestruturaId: number): Promise<void> {
    const fazendaInfraestrutura = await this.findOne(fazendaId, infraestruturaId);
    await this.fazendaInfraestruturaRepository.remove(fazendaInfraestrutura);
  }
}
