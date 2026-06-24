import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustoProducaoService } from './custo-producao.service';
import { CustoProducaoController } from './custo-producao.controller';
import { CustoProducao } from '../../entities/custo-producao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustoProducao])],
  controllers: [CustoProducaoController],
  providers: [CustoProducaoService],
  exports: [CustoProducaoService],
})
export class CustoProducaoModule {}
