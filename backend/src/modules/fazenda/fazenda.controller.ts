import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { FazendaService } from './fazenda.service';
import { Fazenda } from '../../entities/fazenda.entity';

@Controller('fazendas')
export class FazendaController {
  constructor(private readonly fazendaService: FazendaService) {}

  @Post()
  create(@Body() createFazendaDto: Partial<Fazenda>) {
    return this.fazendaService.create(createFazendaDto);
  }

  @Get()
  findAll() {
    return this.fazendaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fazendaService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFazendaDto: Partial<Fazenda>) {
    return this.fazendaService.update(+id, updateFazendaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fazendaService.remove(+id);
  }
}
