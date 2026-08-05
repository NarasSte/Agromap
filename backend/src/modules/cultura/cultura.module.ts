import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaService } from './cultura.service';
import { CulturaController } from './cultura.controller';
import { Cultura } from '../../entities/cultura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cultura])],
  controllers: [CulturaController],
  providers: [CulturaService],
  exports: [CulturaService],
})
export class CulturaModule {}
