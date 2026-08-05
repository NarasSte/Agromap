import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CustoProducaoService } from './custo-producao.service';
import { CustoProducao } from '../../entities/custo-producao.entity';

@Controller('custos-producao')
export class CustoProducaoController {
  constructor(private readonly custoProducaoService: CustoProducaoService) {}

  @Post()
  create(@Body() createCustoProducaoDto: Partial<CustoProducao>) {
    return this.custoProducaoService.create(createCustoProducaoDto);
  }

  @Get()
  findAll() {
    return this.custoProducaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.custoProducaoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCustoProducaoDto: Partial<CustoProducao>) {
    return this.custoProducaoService.update(+id, updateCustoProducaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.custoProducaoService.remove(+id);
  }
}
