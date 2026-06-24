import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrevisaoClimaticaService } from './previsao-climatica.service';
import { PrevisaoClimaticaController } from './previsao-climatica.controller';
import { PrevisaoClimatica } from '../../entities/previsao-climatica.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrevisaoClimatica])],
  controllers: [PrevisaoClimaticaController],
  providers: [PrevisaoClimaticaService],
  exports: [PrevisaoClimaticaService],
})
export class PrevisaoClimaticaModule {}
