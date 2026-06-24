import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecomendacaoClimaService } from './recomendacao-clima.service';
import { RecomendacaoClimaController } from './recomendacao-clima.controller';
import { RecomendacaoClima } from '../../entities/recomendacao-clima.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecomendacaoClima])],
  controllers: [RecomendacaoClimaController],
  providers: [RecomendacaoClimaService],
  exports: [RecomendacaoClimaService],
})
export class RecomendacaoClimaModule {}
