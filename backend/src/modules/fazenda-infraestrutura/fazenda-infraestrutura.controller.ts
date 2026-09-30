import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { FazendaInfraestruturaService } from './fazenda-infraestrutura.service';
import { CreateFazendaInfraestruturaDto } from './dto/create-fazenda-infraestrutura.dto';

@Controller('fazendas-infraestruturas')
export class FazendaInfraestruturaController {
  constructor(private readonly fazendaInfraestruturaService: FazendaInfraestruturaService) {}

  @Post()
  create(@Body() createFazendaInfraestruturaDto: CreateFazendaInfraestruturaDto) {
    return this.fazendaInfraestruturaService.create(createFazendaInfraestruturaDto);
  }

  @Get()
  findAll() {
    return this.fazendaInfraestruturaService.findAll();
  }

  @Get(':fazendaId/:infraestruturaId')
  findOne(@Param('fazendaId') fazendaId: string, @Param('infraestruturaId') infraestruturaId: string) {
    return this.fazendaInfraestruturaService.findOne(+fazendaId, +infraestruturaId);
  }

  @Delete(':fazendaId/:infraestruturaId')
  remove(@Param('fazendaId') fazendaId: string, @Param('infraestruturaId') infraestruturaId: string) {
    return this.fazendaInfraestruturaService.remove(+fazendaId, +infraestruturaId);
  }
}
