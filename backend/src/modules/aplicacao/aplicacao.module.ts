import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AplicacaoService } from './aplicacao.service';
import { AplicacaoController } from './aplicacao.controller';
import { Aplicacao } from '../../entities/aplicacao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aplicacao])],
  controllers: [AplicacaoController],
  providers: [AplicacaoService],
  exports: [AplicacaoService],
})
export class AplicacaoModule {}
