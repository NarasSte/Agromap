import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { Produto } from '../../entities/produto.entity';

@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  create(@Body() createProdutoDto: Partial<Produto>) {
    return this.produtoService.create(createProdutoDto);
  }

  @Get()
  findAll() {
    return this.produtoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProdutoDto: Partial<Produto>) {
    return this.produtoService.update(+id, updateProdutoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtoService.remove(+id);
  }
}
