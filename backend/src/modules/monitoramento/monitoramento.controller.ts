import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MonitoramentoService } from './monitoramento.service';
import { Monitoramento } from '../../entities/monitoramento.entity';

@Controller('monitoramentos')
export class MonitoramentoController {
  constructor(private readonly monitoramentoService: MonitoramentoService) {}

  @Post()
  create(@Body() createMonitoramentoDto: Partial<Monitoramento>) {
    return this.monitoramentoService.create(createMonitoramentoDto);
  }

  @Get()
  findAll() {
    return this.monitoramentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monitoramentoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMonitoramentoDto: Partial<Monitoramento>) {
    return this.monitoramentoService.update(+id, updateMonitoramentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monitoramentoService.remove(+id);
  }
}
