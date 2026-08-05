import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ClimaRegistroService } from './clima-registro.service';
import { ClimaRegistro } from '../../entities/clima-registro.entity';

@Controller('clima-registros')
export class ClimaRegistroController {
  constructor(private readonly climaRegistroService: ClimaRegistroService) {}

  @Post()
  create(@Body() createClimaRegistroDto: Partial<ClimaRegistro>) {
    return this.climaRegistroService.create(createClimaRegistroDto);
  }

  @Get()
  findAll() {
    return this.climaRegistroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.climaRegistroService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateClimaRegistroDto: Partial<ClimaRegistro>) {
    return this.climaRegistroService.update(+id, updateClimaRegistroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.climaRegistroService.remove(+id);
  }
}
