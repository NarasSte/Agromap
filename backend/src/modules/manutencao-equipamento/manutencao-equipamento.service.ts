import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManutencaoEquipamento } from '../../entities/manutencao-equipamento.entity';

@Injectable()
export class ManutencaoEquipamentoService {
  constructor(
    @InjectRepository(ManutencaoEquipamento)
    private readonly manutencaoEquipamentoRepository: Repository<ManutencaoEquipamento>,
  ) {}

  async create(createManutencaoEquipamentoDto: Partial<ManutencaoEquipamento>): Promise<ManutencaoEquipamento> {
    const manutencaoEquipamento = this.manutencaoEquipamentoRepository.create(createManutencaoEquipamentoDto);
    return await this.manutencaoEquipamentoRepository.save(manutencaoEquipamento);
  }

  async findAll(): Promise<ManutencaoEquipamento[]> {
    return await this.manutencaoEquipamentoRepository.find({ relations: ['equipamento'] });
  }

  async findOne(id: number): Promise<ManutencaoEquipamento> {
    const manutencaoEquipamento = await this.manutencaoEquipamentoRepository.findOne({ 
      where: { id },
      relations: ['equipamento']
    });
    if (!manutencaoEquipamento) {
      throw new NotFoundException(`ManutencaoEquipamento with ID ${id} not found`);
    }
    return manutencaoEquipamento;
  }

  async update(id: number, updateManutencaoEquipamentoDto: Partial<ManutencaoEquipamento>): Promise<ManutencaoEquipamento> {
    const manutencaoEquipamento = await this.findOne(id);
    this.manutencaoEquipamentoRepository.merge(manutencaoEquipamento, updateManutencaoEquipamentoDto);
    return await this.manutencaoEquipamentoRepository.save(manutencaoEquipamento);
  }

  async remove(id: number): Promise<void> {
    const manutencaoEquipamento = await this.findOne(id);
    await this.manutencaoEquipamentoRepository.remove(manutencaoEquipamento);
  }
}
