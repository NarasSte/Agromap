import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColheitaService } from './colheita.service';
import { ColheitaController } from './colheita.controller';
import { Colheita } from '../../entities/colheita.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Colheita])],
  controllers: [ColheitaController],
  providers: [ColheitaService],
  exports: [ColheitaService],
})
export class ColheitaModule {}
