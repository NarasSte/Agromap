import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipamentoService } from './equipamento.service';
import { EquipamentoController } from './equipamento.controller';
import { Equipamento } from '../../entities/equipamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Equipamento])],
  controllers: [EquipamentoController],
  providers: [EquipamentoService],
  exports: [EquipamentoService],
})
export class EquipamentoModule {}
