import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecomendacaoClima } from '../../entities/recomendacao-clima.entity';

@Injectable()
export class RecomendacaoClimaService {
  constructor(
    @InjectRepository(RecomendacaoClima)
    private readonly recomendacaoClimaRepository: Repository<RecomendacaoClima>,
  ) {}

  async create(createRecomendacaoClimaDto: Partial<RecomendacaoClima>): Promise<RecomendacaoClima> {
    const recomendacaoClima = this.recomendacaoClimaRepository.create(createRecomendacaoClimaDto);
    return await this.recomendacaoClimaRepository.save(recomendacaoClima);
  }

  async findAll(): Promise<RecomendacaoClima[]> {
    return await this.recomendacaoClimaRepository.find();
  }

  async findOne(id: number): Promise<RecomendacaoClima> {
    const recomendacaoClima = await this.recomendacaoClimaRepository.findOne({ where: { id } });
    if (!recomendacaoClima) {
      throw new NotFoundException(`RecomendacaoClima with ID ${id} not found`);
    }
    return recomendacaoClima;
  }

  async update(id: number, updateRecomendacaoClimaDto: Partial<RecomendacaoClima>): Promise<RecomendacaoClima> {
    const recomendacaoClima = await this.findOne(id);
    this.recomendacaoClimaRepository.merge(recomendacaoClima, updateRecomendacaoClimaDto);
    return await this.recomendacaoClimaRepository.save(recomendacaoClima);
  }

  async remove(id: number): Promise<void> {
    const recomendacaoClima = await this.findOne(id);
    await this.recomendacaoClimaRepository.remove(recomendacaoClima);
  }
}
