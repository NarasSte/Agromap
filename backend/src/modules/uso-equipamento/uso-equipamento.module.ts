import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsoEquipamentoService } from './uso-equipamento.service';
import { UsoEquipamentoController } from './uso-equipamento.controller';
import { UsoEquipamento } from '../../entities/uso-equipamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsoEquipamento])],
  controllers: [UsoEquipamentoController],
  providers: [UsoEquipamentoService],
  exports: [UsoEquipamentoService],
})
export class UsoEquipamentoModule {}
