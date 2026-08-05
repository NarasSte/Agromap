import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AlertaService } from './alerta.service';
import { Alerta } from '../../entities/alerta.entity';

@Controller('alertas')
export class AlertaController {
  constructor(private readonly alertaService: AlertaService) {}

  @Post()
  create(@Body() createAlertaDto: Partial<Alerta>) {
    return this.alertaService.create(createAlertaDto);
  }

  @Get()
  findAll() {
    return this.alertaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertaService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAlertaDto: Partial<Alerta>) {
    return this.alertaService.update(+id, updateAlertaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertaService.remove(+id);
  }
}
