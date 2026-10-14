import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { InfraestruturaService } from './infraestrutura.service';
import { CreateInfraestruturaDto } from './dto/create-infraestrutura.dto';
import { UpdateInfraestruturaDto } from './dto/update-infraestrutura.dto';

@Controller('infraestruturas')
export class InfraestruturaController {
  constructor(private readonly infraestruturaService: InfraestruturaService) {}

  @Post()
  create(@Body() createInfraestruturaDto: CreateInfraestruturaDto) {
    return this.infraestruturaService.create(createInfraestruturaDto);
  }

  @Get()
  findAll() {
    return this.infraestruturaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.infraestruturaService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateInfraestruturaDto: UpdateInfraestruturaDto) {
    return this.infraestruturaService.update(+id, updateInfraestruturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.infraestruturaService.remove(+id);
  }
}
