import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Talhao } from '../../entities/talhao.entity';

@Injectable()
export class TalhaoService {
  constructor(
    @InjectRepository(Talhao)
    private readonly talhaoRepository: Repository<Talhao>,
  ) {}

  async create(createTalhaoDto: Partial<Talhao>): Promise<Talhao> {
    const talhao = this.talhaoRepository.create(createTalhaoDto);
    return await this.talhaoRepository.save(talhao);
  }

  async findAll(): Promise<Talhao[]> {
    return await this.talhaoRepository.find({ relations: ['fazenda'] });
  }

  async findOne(id: number): Promise<Talhao> {
    const talhao = await this.talhaoRepository.findOne({ 
      where: { id },
      relations: ['fazenda']
    });
    if (!talhao) {
      throw new NotFoundException(`Talhao with ID ${id} not found`);
    }
    return talhao;
  }

  async update(id: number, updateTalhaoDto: Partial<Talhao>): Promise<Talhao> {
    const talhao = await this.findOne(id);
    this.talhaoRepository.merge(talhao, updateTalhaoDto);
    return await this.talhaoRepository.save(talhao);
  }

  async remove(id: number): Promise<void> {
    const talhao = await this.findOne(id);
    await this.talhaoRepository.remove(talhao);
  }
}
