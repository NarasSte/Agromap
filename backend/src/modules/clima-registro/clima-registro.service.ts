import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClimaRegistro } from '../../entities/clima-registro.entity';

@Injectable()
export class ClimaRegistroService {
  constructor(
    @InjectRepository(ClimaRegistro)
    private readonly climaRegistroRepository: Repository<ClimaRegistro>,
  ) {}

  async create(createClimaRegistroDto: Partial<ClimaRegistro>): Promise<ClimaRegistro> {
    const climaRegistro = this.climaRegistroRepository.create(createClimaRegistroDto);
    return await this.climaRegistroRepository.save(climaRegistro);
  }

  async findAll(): Promise<ClimaRegistro[]> {
    return await this.climaRegistroRepository.find({ relations: ['talhao'] });
  }

  async findOne(id: number): Promise<ClimaRegistro> {
    const climaRegistro = await this.climaRegistroRepository.findOne({ 
      where: { id },
      relations: ['talhao']
    });
    if (!climaRegistro) {
      throw new NotFoundException(`ClimaRegistro with ID ${id} not found`);
    }
    return climaRegistro;
  }

  async update(id: number, updateClimaRegistroDto: Partial<ClimaRegistro>): Promise<ClimaRegistro> {
    const climaRegistro = await this.findOne(id);
    this.climaRegistroRepository.merge(climaRegistro, updateClimaRegistroDto);
    return await this.climaRegistroRepository.save(climaRegistro);
  }

  async remove(id: number): Promise<void> {
    const climaRegistro = await this.findOne(id);
    await this.climaRegistroRepository.remove(climaRegistro);
  }
}
