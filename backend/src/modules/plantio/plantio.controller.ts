import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PlantioService } from './plantio.service';
import { Plantio } from '../../entities/plantio.entity';

@Controller('plantios')
export class PlantioController {
  constructor(private readonly plantioService: PlantioService) {}

  @Post()
  create(@Body() createPlantioDto: Partial<Plantio>) {
    return this.plantioService.create(createPlantioDto);
  }

  @Get()
  findAll() {
    return this.plantioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plantioService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePlantioDto: Partial<Plantio>) {
    return this.plantioService.update(+id, updatePlantioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plantioService.remove(+id);
  }
}
