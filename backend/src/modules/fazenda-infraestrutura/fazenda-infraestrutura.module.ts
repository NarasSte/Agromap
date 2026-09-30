import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FazendaInfraestruturaService } from './fazenda-infraestrutura.service';
import { FazendaInfraestruturaController } from './fazenda-infraestrutura.controller';
import { FazendaInfraestrutura } from '../../entities/fazenda-infraestrutura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FazendaInfraestrutura])],
  controllers: [FazendaInfraestruturaController],
  providers: [FazendaInfraestruturaService],
  exports: [FazendaInfraestruturaService],
})
export class FazendaInfraestruturaModule {}
