import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsoEquipamento } from '../../entities/uso-equipamento.entity';

@Injectable()
export class UsoEquipamentoService {
  constructor(
    @InjectRepository(UsoEquipamento)
    private readonly usoEquipamentoRepository: Repository<UsoEquipamento>,
  ) {}

  async create(createUsoEquipamentoDto: Partial<UsoEquipamento>): Promise<UsoEquipamento> {
    const usoEquipamento = this.usoEquipamentoRepository.create(createUsoEquipamentoDto);
    return await this.usoEquipamentoRepository.save(usoEquipamento);
  }

  async findAll(): Promise<UsoEquipamento[]> {
    return await this.usoEquipamentoRepository.find({ relations: ['equipamento', 'aplicacao', 'irrigacao', 'plantio'] });
  }

  async findOne(id: number): Promise<UsoEquipamento> {
    const usoEquipamento = await this.usoEquipamentoRepository.findOne({ 
      where: { id },
      relations: ['equipamento', 'aplicacao', 'irrigacao', 'plantio']
    });
    if (!usoEquipamento) {
      throw new NotFoundException(`UsoEquipamento with ID ${id} not found`);
    }
    return usoEquipamento;
  }

  async update(id: number, updateUsoEquipamentoDto: Partial<UsoEquipamento>): Promise<UsoEquipamento> {
    const usoEquipamento = await this.findOne(id);
    this.usoEquipamentoRepository.merge(usoEquipamento, updateUsoEquipamentoDto);
    return await this.usoEquipamentoRepository.save(usoEquipamento);
  }

  async remove(id: number): Promise<void> {
    const usoEquipamento = await this.findOne(id);
    await this.usoEquipamentoRepository.remove(usoEquipamento);
  }
}
