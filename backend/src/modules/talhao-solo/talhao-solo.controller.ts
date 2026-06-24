import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TalhaoSoloService } from './talhao-solo.service';
import { TalhaoSolo } from '../../entities/talhao-solo.entity';

@Controller('talhoes-solos')
export class TalhaoSoloController {
  constructor(private readonly talhaoSoloService: TalhaoSoloService) {}

  @Post()
  create(@Body() createTalhaoSoloDto: Partial<TalhaoSolo>) {
    return this.talhaoSoloService.create(createTalhaoSoloDto);
  }

  @Get()
  findAll() {
    return this.talhaoSoloService.findAll();
  }

  @Get(':talhaoId/:soloId')
  findOne(@Param('talhaoId') talhaoId: string, @Param('soloId') soloId: string) {
    return this.talhaoSoloService.findOne(+talhaoId, +soloId);
  }

  @Put(':talhaoId/:soloId')
  update(@Param('talhaoId') talhaoId: string, @Param('soloId') soloId: string, @Body() updateTalhaoSoloDto: Partial<TalhaoSolo>) {
    return this.talhaoSoloService.update(+talhaoId, +soloId, updateTalhaoSoloDto);
  }

  @Delete(':talhaoId/:soloId')
  remove(@Param('talhaoId') talhaoId: string, @Param('soloId') soloId: string) {
    return this.talhaoSoloService.remove(+talhaoId, +soloId);
  }
}
