import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Monitoramento } from '../../entities/monitoramento.entity';

@Injectable()
export class MonitoramentoService {
  constructor(
    @InjectRepository(Monitoramento)
    private readonly monitoramentoRepository: Repository<Monitoramento>,
  ) {}

  async create(createMonitoramentoDto: Partial<Monitoramento>): Promise<Monitoramento> {
    const monitoramento = this.monitoramentoRepository.create(createMonitoramentoDto);
    return await this.monitoramentoRepository.save(monitoramento);
  }

  async findAll(): Promise<Monitoramento[]> {
    return await this.monitoramentoRepository.find({ relations: ['talhao', 'plantio'] });
  }

  async findOne(id: number): Promise<Monitoramento> {
    const monitoramento = await this.monitoramentoRepository.findOne({ 
      where: { id },
      relations: ['talhao', 'plantio']
    });
    if (!monitoramento) {
      throw new NotFoundException(`Monitoramento with ID ${id} not found`);
    }
    return monitoramento;
  }

  async update(id: number, updateMonitoramentoDto: Partial<Monitoramento>): Promise<Monitoramento> {
    const monitoramento = await this.findOne(id);
    this.monitoramentoRepository.merge(monitoramento, updateMonitoramentoDto);
    return await this.monitoramentoRepository.save(monitoramento);
  }

  async remove(id: number): Promise<void> {
    const monitoramento = await this.findOne(id);
    await this.monitoramentoRepository.remove(monitoramento);
  }
}
