import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Infraestrutura } from '../../entities/infraestrutura.entity';
import { CreateInfraestruturaDto } from './dto/create-infraestrutura.dto';
import { UpdateInfraestruturaDto } from './dto/update-infraestrutura.dto';

@Injectable()
export class InfraestruturaService {
  constructor(
    @InjectRepository(Infraestrutura)
    private readonly infraestruturaRepository: Repository<Infraestrutura>,
  ) {}

  async create(createInfraestruturaDto: CreateInfraestruturaDto): Promise<Infraestrutura> {
    const infraestrutura = this.infraestruturaRepository.create(createInfraestruturaDto);
    return await this.infraestruturaRepository.save(infraestrutura);
  }

  async findAll(): Promise<Infraestrutura[]> {
    return await this.infraestruturaRepository.find();
  }

  async findOne(id: number): Promise<Infraestrutura> {
    const infraestrutura = await this.infraestruturaRepository.findOne({ where: { id } });
    if (!infraestrutura) {
      throw new NotFoundException(`Infraestrutura with ID ${id} not found`);
    }
    return infraestrutura;
  }

  async update(id: number, updateInfraestruturaDto: UpdateInfraestruturaDto): Promise<Infraestrutura> {
    const infraestrutura = await this.findOne(id);
    this.infraestruturaRepository.merge(infraestrutura, updateInfraestruturaDto);
    return await this.infraestruturaRepository.save(infraestrutura);
  }

  async remove(id: number): Promise<void> {
    const infraestrutura = await this.findOne(id);
    await this.infraestruturaRepository.remove(infraestrutura);
  }
}
