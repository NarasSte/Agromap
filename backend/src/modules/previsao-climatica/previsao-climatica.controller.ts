import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PrevisaoClimaticaService } from './previsao-climatica.service';
import { PrevisaoClimatica } from '../../entities/previsao-climatica.entity';

@Controller('previsoes-climaticas')
export class PrevisaoClimaticaController {
  constructor(private readonly previsaoClimaticaService: PrevisaoClimaticaService) {}

  @Post()
  create(@Body() createPrevisaoClimaticaDto: Partial<PrevisaoClimatica>) {
    return this.previsaoClimaticaService.create(createPrevisaoClimaticaDto);
  }

  @Get()
  findAll() {
    return this.previsaoClimaticaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.previsaoClimaticaService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePrevisaoClimaticaDto: Partial<PrevisaoClimatica>) {
    return this.previsaoClimaticaService.update(+id, updatePrevisaoClimaticaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.previsaoClimaticaService.remove(+id);
  }
}
