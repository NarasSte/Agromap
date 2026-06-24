import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alerta } from '../../entities/alerta.entity';

@Injectable()
export class AlertaService {
  constructor(
    @InjectRepository(Alerta)
    private readonly alertaRepository: Repository<Alerta>,
  ) {}

  async create(createAlertaDto: Partial<Alerta>): Promise<Alerta> {
    const alerta = this.alertaRepository.create(createAlertaDto);
    return await this.alertaRepository.save(alerta);
  }

  async findAll(): Promise<Alerta[]> {
    return await this.alertaRepository.find({ relations: ['talhao'] });
  }

  async findOne(id: number): Promise<Alerta> {
    const alerta = await this.alertaRepository.findOne({ 
      where: { id },
      relations: ['talhao']
    });
    if (!alerta) {
      throw new NotFoundException(`Alerta with ID ${id} not found`);
    }
    return alerta;
  }

  async update(id: number, updateAlertaDto: Partial<Alerta>): Promise<Alerta> {
    const alerta = await this.findOne(id);
    this.alertaRepository.merge(alerta, updateAlertaDto);
    return await this.alertaRepository.save(alerta);
  }

  async remove(id: number): Promise<void> {
    const alerta = await this.findOne(id);
    await this.alertaRepository.remove(alerta);
  }
}
