import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RecomendacaoClimaService } from './recomendacao-clima.service';
import { RecomendacaoClima } from '../../entities/recomendacao-clima.entity';

@Controller('recomendacoes-clima')
export class RecomendacaoClimaController {
  constructor(private readonly recomendacaoClimaService: RecomendacaoClimaService) {}

  @Post()
  create(@Body() createRecomendacaoClimaDto: Partial<RecomendacaoClima>) {
    return this.recomendacaoClimaService.create(createRecomendacaoClimaDto);
  }

  @Get()
  findAll() {
    return this.recomendacaoClimaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recomendacaoClimaService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRecomendacaoClimaDto: Partial<RecomendacaoClima>) {
    return this.recomendacaoClimaService.update(+id, updateRecomendacaoClimaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recomendacaoClimaService.remove(+id);
  }
}
