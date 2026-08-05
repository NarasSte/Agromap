import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aplicacao } from '../../entities/aplicacao.entity';

@Injectable()
export class AplicacaoService {
  constructor(
    @InjectRepository(Aplicacao)
    private readonly aplicacaoRepository: Repository<Aplicacao>,
  ) {}

  async create(createAplicacaoDto: Partial<Aplicacao>): Promise<Aplicacao> {
    const aplicacao = this.aplicacaoRepository.create(createAplicacaoDto);
    return await this.aplicacaoRepository.save(aplicacao);
  }

  async findAll(): Promise<Aplicacao[]> {
    return await this.aplicacaoRepository.find({ relations: ['talhao', 'plantio', 'monitoramento', 'produto'] });
  }

  async findOne(id: number): Promise<Aplicacao> {
    const aplicacao = await this.aplicacaoRepository.findOne({ 
      where: { id },
      relations: ['talhao', 'plantio', 'monitoramento', 'produto']
    });
    if (!aplicacao) {
      throw new NotFoundException(`Aplicacao with ID ${id} not found`);
    }
    return aplicacao;
  }

  async update(id: number, updateAplicacaoDto: Partial<Aplicacao>): Promise<Aplicacao> {
    const aplicacao = await this.findOne(id);
    this.aplicacaoRepository.merge(aplicacao, updateAplicacaoDto);
    return await this.aplicacaoRepository.save(aplicacao);
  }

  async remove(id: number): Promise<void> {
    const aplicacao = await this.findOne(id);
    await this.aplicacaoRepository.remove(aplicacao);
  }
}
