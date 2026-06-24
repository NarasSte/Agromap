import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitoramentoService } from './monitoramento.service';
import { MonitoramentoController } from './monitoramento.controller';
import { Monitoramento } from '../../entities/monitoramento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Monitoramento])],
  controllers: [MonitoramentoController],
  providers: [MonitoramentoService],
  exports: [MonitoramentoService],
})
export class MonitoramentoModule {}
