import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TalhaoSolo } from '../../entities/talhao-solo.entity';

@Injectable()
export class TalhaoSoloService {
  constructor(
    @InjectRepository(TalhaoSolo)
    private readonly talhaoSoloRepository: Repository<TalhaoSolo>,
  ) {}

  async create(createTalhaoSoloDto: Partial<TalhaoSolo>): Promise<TalhaoSolo> {
    const talhaoSolo = this.talhaoSoloRepository.create(createTalhaoSoloDto);
    return await this.talhaoSoloRepository.save(talhaoSolo);
  }

  async findAll(): Promise<TalhaoSolo[]> {
    return await this.talhaoSoloRepository.find({ relations: ['talhao', 'solo'] });
  }

  async findOne(talhaoId: number, soloId: number): Promise<TalhaoSolo> {
    const talhaoSolo = await this.talhaoSoloRepository.findOne({ 
      where: { talhao_id: talhaoId, solo_id: soloId },
      relations: ['talhao', 'solo']
    });
    if (!talhaoSolo) {
      throw new NotFoundException(`TalhaoSolo with talhao_id ${talhaoId} and solo_id ${soloId} not found`);
    }
    return talhaoSolo;
  }

  async update(talhaoId: number, soloId: number, updateTalhaoSoloDto: Partial<TalhaoSolo>): Promise<TalhaoSolo> {
    const talhaoSolo = await this.findOne(talhaoId, soloId);
    this.talhaoSoloRepository.merge(talhaoSolo, updateTalhaoSoloDto);
    return await this.talhaoSoloRepository.save(talhaoSolo);
  }

  async remove(talhaoId: number, soloId: number): Promise<void> {
    const talhaoSolo = await this.findOne(talhaoId, soloId);
    await this.talhaoSoloRepository.remove(talhaoSolo);
  }
}
