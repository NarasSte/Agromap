import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from '../../entities/produto.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
  ) {}

  async create(createProdutoDto: Partial<Produto>): Promise<Produto> {
    const produto = this.produtoRepository.create(createProdutoDto);
    return await this.produtoRepository.save(produto);
  }

  async findAll(): Promise<Produto[]> {
    return await this.produtoRepository.find();
  }

  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({ where: { id } });
    if (!produto) {
      throw new NotFoundException(`Produto with ID ${id} not found`);
    }
    return produto;
  }

  async update(id: number, updateProdutoDto: Partial<Produto>): Promise<Produto> {
    const produto = await this.findOne(id);
    this.produtoRepository.merge(produto, updateProdutoDto);
    return await this.produtoRepository.save(produto);
  }

  async remove(id: number): Promise<void> {
    const produto = await this.findOne(id);
    await this.produtoRepository.remove(produto);
  }
}
