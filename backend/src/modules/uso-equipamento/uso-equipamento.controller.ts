import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UsoEquipamentoService } from './uso-equipamento.service';
import { UsoEquipamento } from '../../entities/uso-equipamento.entity';

@Controller('usos-equipamentos')
export class UsoEquipamentoController {
  constructor(private readonly usoEquipamentoService: UsoEquipamentoService) {}

  @Post()
  create(@Body() createUsoEquipamentoDto: Partial<UsoEquipamento>) {
    return this.usoEquipamentoService.create(createUsoEquipamentoDto);
  }

  @Get()
  findAll() {
    return this.usoEquipamentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usoEquipamentoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUsoEquipamentoDto: Partial<UsoEquipamento>) {
    return this.usoEquipamentoService.update(+id, updateUsoEquipamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usoEquipamentoService.remove(+id);
  }
}
