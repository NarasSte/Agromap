import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FazendaService } from './fazenda.service';
import { FazendaController } from './fazenda.controller';
import { Fazenda } from '../../entities/fazenda.entity';
import { Infraestrutura } from '../../entities/infraestrutura.entity';
import { FazendaInfraestrutura } from '../../entities/fazenda-infraestrutura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fazenda, Infraestrutura, FazendaInfraestrutura])],
  controllers: [FazendaController],
  providers: [FazendaService],
  exports: [FazendaService],
})
export class FazendaModule {}
