import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrrigacaoService } from './irrigacao.service';
import { IrrigacaoController } from './irrigacao.controller';
import { Irrigacao } from '../../entities/irrigacao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Irrigacao])],
  controllers: [IrrigacaoController],
  providers: [IrrigacaoService],
  exports: [IrrigacaoService],
})
export class IrrigacaoModule {}
