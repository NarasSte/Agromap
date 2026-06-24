import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plantio } from '../../entities/plantio.entity';

@Injectable()
export class PlantioService {
  constructor(
    @InjectRepository(Plantio)
    private readonly plantioRepository: Repository<Plantio>,
  ) {}

  async create(createPlantioDto: Partial<Plantio>): Promise<Plantio> {
    const plantio = this.plantioRepository.create(createPlantioDto);
    return await this.plantioRepository.save(plantio);
  }

  async findAll(): Promise<Plantio[]> {
    return await this.plantioRepository.find({ relations: ['talhao', 'cultura'] });
  }

  async findOne(id: number): Promise<Plantio> {
    const plantio = await this.plantioRepository.findOne({ 
      where: { id },
      relations: ['talhao', 'cultura']
    });
    if (!plantio) {
      throw new NotFoundException(`Plantio with ID ${id} not found`);
    }
    return plantio;
  }

  async update(id: number, updatePlantioDto: Partial<Plantio>): Promise<Plantio> {
    const plantio = await this.findOne(id);
    this.plantioRepository.merge(plantio, updatePlantioDto);
    return await this.plantioRepository.save(plantio);
  }

  async remove(id: number): Promise<void> {
    const plantio = await this.findOne(id);
    await this.plantioRepository.remove(plantio);
  }
}
