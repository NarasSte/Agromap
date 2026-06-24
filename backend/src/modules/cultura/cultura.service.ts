import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cultura } from '../../entities/cultura.entity';

@Injectable()
export class CulturaService {
  constructor(
    @InjectRepository(Cultura)
    private readonly culturaRepository: Repository<Cultura>,
  ) {}

  async create(createCulturaDto: Partial<Cultura>): Promise<Cultura> {
    const cultura = this.culturaRepository.create(createCulturaDto);
    return await this.culturaRepository.save(cultura);
  }

  async findAll(): Promise<Cultura[]> {
    return await this.culturaRepository.find();
  }

  async findOne(id: number): Promise<Cultura> {
    const cultura = await this.culturaRepository.findOne({ where: { id } });
    if (!cultura) {
      throw new NotFoundException(`Cultura with ID ${id} not found`);
    }
    return cultura;
  }

  async update(id: number, updateCulturaDto: Partial<Cultura>): Promise<Cultura> {
    const cultura = await this.findOne(id);
    this.culturaRepository.merge(cultura, updateCulturaDto);
    return await this.culturaRepository.save(cultura);
  }

  async remove(id: number): Promise<void> {
    const cultura = await this.findOne(id);
    await this.culturaRepository.remove(cultura);
  }
}
