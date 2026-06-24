import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertaService } from './alerta.service';
import { AlertaController } from './alerta.controller';
import { Alerta } from '../../entities/alerta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alerta])],
  controllers: [AlertaController],
  providers: [AlertaService],
  exports: [AlertaService],
})
export class AlertaModule {}
