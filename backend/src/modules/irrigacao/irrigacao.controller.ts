import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { IrrigacaoService } from './irrigacao.service';
import { Irrigacao } from '../../entities/irrigacao.entity';

@Controller('irrigacoes')
export class IrrigacaoController {
  constructor(private readonly irrigacaoService: IrrigacaoService) {}

  @Post()
  create(@Body() createIrrigacaoDto: Partial<Irrigacao>) {
    return this.irrigacaoService.create(createIrrigacaoDto);
  }

  @Get()
  findAll() {
    return this.irrigacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.irrigacaoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateIrrigacaoDto: Partial<Irrigacao>) {
    return this.irrigacaoService.update(+id, updateIrrigacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.irrigacaoService.remove(+id);
  }
}
