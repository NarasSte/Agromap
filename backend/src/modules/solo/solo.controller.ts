import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SoloService } from './solo.service';
import { Solo } from '../../entities/solo.entity';

@Controller('solos')
export class SoloController {
  constructor(private readonly soloService: SoloService) {}

  @Post()
  create(@Body() createSoloDto: Partial<Solo>) {
    return this.soloService.create(createSoloDto);
  }

  @Get()
  findAll() {
    return this.soloService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.soloService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSoloDto: Partial<Solo>) {
    return this.soloService.update(+id, updateSoloDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.soloService.remove(+id);
  }
}
