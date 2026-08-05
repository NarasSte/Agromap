import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Irrigacao } from '../../entities/irrigacao.entity';

@Injectable()
export class IrrigacaoService {
  constructor(
    @InjectRepository(Irrigacao)
    private readonly irrigacaoRepository: Repository<Irrigacao>,
  ) {}

  async create(createIrrigacaoDto: Partial<Irrigacao>): Promise<Irrigacao> {
    const irrigacao = this.irrigacaoRepository.create(createIrrigacaoDto);
    return await this.irrigacaoRepository.save(irrigacao);
  }

  async findAll(): Promise<Irrigacao[]> {
    return await this.irrigacaoRepository.find({ relations: ['talhao', 'plantio'] });
  }

  async findOne(id: number): Promise<Irrigacao> {
    const irrigacao = await this.irrigacaoRepository.findOne({ 
      where: { id },
      relations: ['talhao', 'plantio']
    });
    if (!irrigacao) {
      throw new NotFoundException(`Irrigacao with ID ${id} not found`);
    }
    return irrigacao;
  }

  async update(id: number, updateIrrigacaoDto: Partial<Irrigacao>): Promise<Irrigacao> {
    const irrigacao = await this.findOne(id);
    this.irrigacaoRepository.merge(irrigacao, updateIrrigacaoDto);
    return await this.irrigacaoRepository.save(irrigacao);
  }

  async remove(id: number): Promise<void> {
    const irrigacao = await this.findOne(id);
    await this.irrigacaoRepository.remove(irrigacao);
  }
}
