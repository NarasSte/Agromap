import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { EquipamentoService } from './equipamento.service';
import { Equipamento } from '../../entities/equipamento.entity';

@Controller('equipamentos')
export class EquipamentoController {
  constructor(private readonly equipamentoService: EquipamentoService) {}

  @Post()
  create(@Body() createEquipamentoDto: Partial<Equipamento>) {
    return this.equipamentoService.create(createEquipamentoDto);
  }

  @Get()
  findAll() {
    return this.equipamentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipamentoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEquipamentoDto: Partial<Equipamento>) {
    return this.equipamentoService.update(+id, updateEquipamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipamentoService.remove(+id);
  }
}
