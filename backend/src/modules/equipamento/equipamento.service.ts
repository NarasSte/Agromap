import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipamento } from '../../entities/equipamento.entity';

@Injectable()
export class EquipamentoService {
  constructor(
    @InjectRepository(Equipamento)
    private readonly equipamentoRepository: Repository<Equipamento>,
  ) {}

  async create(createEquipamentoDto: Partial<Equipamento>): Promise<Equipamento> {
    const equipamento = this.equipamentoRepository.create(createEquipamentoDto);
    return await this.equipamentoRepository.save(equipamento);
  }

  async findAll(): Promise<Equipamento[]> {
    return await this.equipamentoRepository.find();
  }

  async findOne(id: number): Promise<Equipamento> {
    const equipamento = await this.equipamentoRepository.findOne({ where: { id } });
    if (!equipamento) {
      throw new NotFoundException(`Equipamento with ID ${id} not found`);
    }
    return equipamento;
  }

  async update(id: number, updateEquipamentoDto: Partial<Equipamento>): Promise<Equipamento> {
    const equipamento = await this.findOne(id);
    this.equipamentoRepository.merge(equipamento, updateEquipamentoDto);
    return await this.equipamentoRepository.save(equipamento);
  }

  async remove(id: number): Promise<void> {
    const equipamento = await this.findOne(id);
    await this.equipamentoRepository.remove(equipamento);
  }
}
