import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TalhaoService } from './talhao.service';
import { Talhao } from '../../entities/talhao.entity';

@Controller('talhoes')
export class TalhaoController {
  constructor(private readonly talhaoService: TalhaoService) {}

  @Post()
  create(@Body() createTalhaoDto: Partial<Talhao>) {
    return this.talhaoService.create(createTalhaoDto);
  }

  @Get()
  findAll() {
    return this.talhaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.talhaoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTalhaoDto: Partial<Talhao>) {
    return this.talhaoService.update(+id, updateTalhaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.talhaoService.remove(+id);
  }
}
