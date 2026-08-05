import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ColheitaService } from './colheita.service';
import { Colheita } from '../../entities/colheita.entity';

@Controller('colheitas')
export class ColheitaController {
  constructor(private readonly colheitaService: ColheitaService) {}

  @Post()
  create(@Body() createColheitaDto: Partial<Colheita>) {
    return this.colheitaService.create(createColheitaDto);
  }

  @Get()
  findAll() {
    return this.colheitaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colheitaService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateColheitaDto: Partial<Colheita>) {
    return this.colheitaService.update(+id, updateColheitaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colheitaService.remove(+id);
  }
}
