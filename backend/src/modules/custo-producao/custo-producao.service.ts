import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustoProducao } from '../../entities/custo-producao.entity';

@Injectable()
export class CustoProducaoService {
  constructor(
    @InjectRepository(CustoProducao)
    private readonly custoProducaoRepository: Repository<CustoProducao>,
  ) {}

  async create(createCustoProducaoDto: Partial<CustoProducao>): Promise<CustoProducao> {
    const custoProducao = this.custoProducaoRepository.create(createCustoProducaoDto);
    return await this.custoProducaoRepository.save(custoProducao);
  }

  async findAll(): Promise<CustoProducao[]> {
    return await this.custoProducaoRepository.find({ relations: ['plantio'] });
  }

  async findOne(id: number): Promise<CustoProducao> {
    const custoProducao = await this.custoProducaoRepository.findOne({ 
      where: { id },
      relations: ['plantio']
    });
    if (!custoProducao) {
      throw new NotFoundException(`CustoProducao with ID ${id} not found`);
    }
    return custoProducao;
  }

  async update(id: number, updateCustoProducaoDto: Partial<CustoProducao>): Promise<CustoProducao> {
    const custoProducao = await this.findOne(id);
    this.custoProducaoRepository.merge(custoProducao, updateCustoProducaoDto);
    return await this.custoProducaoRepository.save(custoProducao);
  }

  async remove(id: number): Promise<void> {
    const custoProducao = await this.findOne(id);
    await this.custoProducaoRepository.remove(custoProducao);
  }
}
