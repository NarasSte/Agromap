import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CulturaService } from './cultura.service';
import { Cultura } from '../../entities/cultura.entity';
import { TipoUsuario } from '../../entities/usuario.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('culturas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(TipoUsuario.ADMIN)
export class CulturaController {
  constructor(private readonly culturaService: CulturaService) {}

  @Post()
  create(@Body() createCulturaDto: Partial<Cultura>) {
    return this.culturaService.create(createCulturaDto);
  }

  @Get()
  findAll() {
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
