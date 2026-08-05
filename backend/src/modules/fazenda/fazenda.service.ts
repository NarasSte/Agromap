import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fazenda } from '../../entities/fazenda.entity';

@Injectable()
export class FazendaService {
  constructor(
    @InjectRepository(Fazenda)
    private readonly fazendaRepository: Repository<Fazenda>,
  ) {}

  async create(createFazendaDto: Partial<Fazenda>): Promise<Fazenda> {
    const fazenda = this.fazendaRepository.create(createFazendaDto);
    return await this.fazendaRepository.save(fazenda);
  }

  async findAll(): Promise<Fazenda[]> {
    return await this.fazendaRepository.find();
  }

  async findOne(id: number): Promise<Fazenda> {
    const fazenda = await this.fazendaRepository.findOne({ where: { id } });
    if (!fazenda) {
      throw new NotFoundException(`Fazenda with ID ${id} not found`);
    }
    return fazenda;
  }

  async update(id: number, updateFazendaDto: Partial<Fazenda>): Promise<Fazenda> {
    const fazenda = await this.findOne(id);
    this.fazendaRepository.merge(fazenda, updateFazendaDto);
    return await this.fazendaRepository.save(fazenda);
  }

  async remove(id: number): Promise<void> {
    const fazenda = await this.findOne(id);
    await this.fazendaRepository.remove(fazenda);
  }
}
