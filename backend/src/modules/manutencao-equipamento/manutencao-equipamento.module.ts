import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManutencaoEquipamentoService } from './manutencao-equipamento.service';
import { ManutencaoEquipamentoController } from './manutencao-equipamento.controller';
import { ManutencaoEquipamento } from '../../entities/manutencao-equipamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ManutencaoEquipamento])],
  controllers: [ManutencaoEquipamentoController],
  providers: [ManutencaoEquipamentoService],
  exports: [ManutencaoEquipamentoService],
})
export class ManutencaoEquipamentoModule {}
