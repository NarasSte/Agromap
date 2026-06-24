import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AplicacaoService } from './aplicacao.service';
import { Aplicacao } from '../../entities/aplicacao.entity';

@Controller('aplicacoes')
export class AplicacaoController {
  constructor(private readonly aplicacaoService: AplicacaoService) {}

  @Post()
  create(@Body() createAplicacaoDto: Partial<Aplicacao>) {
    return this.aplicacaoService.create(createAplicacaoDto);
  }

  @Get()
  findAll() {
    return this.aplicacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aplicacaoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAplicacaoDto: Partial<Aplicacao>) {
    return this.aplicacaoService.update(+id, updateAplicacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aplicacaoService.remove(+id);
  }
}
