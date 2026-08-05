import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CulturaService } from './cultura.service';
import { Cultura } from '../../entities/cultura.entity';

@Controller('culturas')
export class CulturaController {
  constructor(private readonly culturaService: CulturaService) {}

  @Post()
  create(@Body() createCulturaDto: Partial<Cultura>) {
    return this.culturaService.create(createCulturaDto);
  }

  @Get()
  findAll() {
    console.log('hello world -> buscando culturas')
    return this.culturaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.culturaService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCulturaDto: Partial<Cultura>) {
    return this.culturaService.update(+id, updateCulturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.culturaService.remove(+id);
  }
}
