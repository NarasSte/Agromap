import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Colheita } from '../../entities/colheita.entity';

@Injectable()
export class ColheitaService {
  constructor(
    @InjectRepository(Colheita)
    private readonly colheitaRepository: Repository<Colheita>,
  ) {}

  async create(createColheitaDto: Partial<Colheita>): Promise<Colheita> {
    const colheita = this.colheitaRepository.create(createColheitaDto);
    return await this.colheitaRepository.save(colheita);
  }

  async findAll(): Promise<Colheita[]> {
    return await this.colheitaRepository.find({ relations: ['talhao', 'plantio'] });
  }

  async findOne(id: number): Promise<Colheita> {
    const colheita = await this.colheitaRepository.findOne({ 
      where: { id },
      relations: ['talhao', 'plantio']
    });
    if (!colheita) {
      throw new NotFoundException(`Colheita with ID ${id} not found`);
    }
    return colheita;
  }

  async update(id: number, updateColheitaDto: Partial<Colheita>): Promise<Colheita> {
    const colheita = await this.findOne(id);
    this.colheitaRepository.merge(colheita, updateColheitaDto);
    return await this.colheitaRepository.save(colheita);
  }

  async remove(id: number): Promise<void> {
    const colheita = await this.findOne(id);
    await this.colheitaRepository.remove(colheita);
  }
}
