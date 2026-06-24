import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrevisaoClimatica } from '../../entities/previsao-climatica.entity';

@Injectable()
export class PrevisaoClimaticaService {
  constructor(
    @InjectRepository(PrevisaoClimatica)
    private readonly previsaoClimaticaRepository: Repository<PrevisaoClimatica>,
  ) {}

  async create(createPrevisaoClimaticaDto: Partial<PrevisaoClimatica>): Promise<PrevisaoClimatica> {
    const previsaoClimatica = this.previsaoClimaticaRepository.create(createPrevisaoClimaticaDto);
    return await this.previsaoClimaticaRepository.save(previsaoClimatica);
  }

  async findAll(): Promise<PrevisaoClimatica[]> {
    return await this.previsaoClimaticaRepository.find({ relations: ['talhao'] });
  }

  async findOne(id: number): Promise<PrevisaoClimatica> {
    const previsaoClimatica = await this.previsaoClimaticaRepository.findOne({ 
      where: { id },
      relations: ['talhao']
    });
    if (!previsaoClimatica) {
      throw new NotFoundException(`PrevisaoClimatica with ID ${id} not found`);
    }
    return previsaoClimatica;
  }

  async update(id: number, updatePrevisaoClimaticaDto: Partial<PrevisaoClimatica>): Promise<PrevisaoClimatica> {
    const previsaoClimatica = await this.findOne(id);
    this.previsaoClimaticaRepository.merge(previsaoClimatica, updatePrevisaoClimaticaDto);
    return await this.previsaoClimaticaRepository.save(previsaoClimatica);
  }

  async remove(id: number): Promise<void> {
    const previsaoClimatica = await this.findOne(id);
    await this.previsaoClimaticaRepository.remove(previsaoClimatica);
  }
}
