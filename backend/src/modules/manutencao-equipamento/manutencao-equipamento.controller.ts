import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ManutencaoEquipamentoService } from './manutencao-equipamento.service';
import { ManutencaoEquipamento } from '../../entities/manutencao-equipamento.entity';

@Controller('manutencoes-equipamentos')
export class ManutencaoEquipamentoController {
  constructor(private readonly manutencaoEquipamentoService: ManutencaoEquipamentoService) {}

  @Post()
  create(@Body() createManutencaoEquipamentoDto: Partial<ManutencaoEquipamento>) {
    return this.manutencaoEquipamentoService.create(createManutencaoEquipamentoDto);
  }

  @Get()
  findAll() {
    return this.manutencaoEquipamentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manutencaoEquipamentoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateManutencaoEquipamentoDto: Partial<ManutencaoEquipamento>) {
    return this.manutencaoEquipamentoService.update(+id, updateManutencaoEquipamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.manutencaoEquipamentoService.remove(+id);
  }
}
