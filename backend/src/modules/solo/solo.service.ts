import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solo } from '../../entities/solo.entity';

@Injectable()
export class SoloService {
  constructor(
    @InjectRepository(Solo)
    private readonly soloRepository: Repository<Solo>,
  ) {}

  async create(createSoloDto: Partial<Solo>): Promise<Solo> {
    const solo = this.soloRepository.create(createSoloDto);
    return await this.soloRepository.save(solo);
  }

  async findAll(): Promise<Solo[]> {
    return await this.soloRepository.find();
  }

  async findOne(id: number): Promise<Solo> {
    const solo = await this.soloRepository.findOne({ where: { id } });
    if (!solo) {
      throw new NotFoundException(`Solo with ID ${id} not found`);
    }
    return solo;
  }

  async update(id: number, updateSoloDto: Partial<Solo>): Promise<Solo> {
    const solo = await this.findOne(id);
    this.soloRepository.merge(solo, updateSoloDto);
    return await this.soloRepository.save(solo);
  }

  async remove(id: number): Promise<void> {
    const solo = await this.findOne(id);
    await this.soloRepository.remove(solo);
  }
}
