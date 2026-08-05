import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TalhaoSoloService } from './talhao-solo.service';
import { TalhaoSoloController } from './talhao-solo.controller';
import { TalhaoSolo } from '../../entities/talhao-solo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TalhaoSolo])],
  controllers: [TalhaoSoloController],
  providers: [TalhaoSoloService],
  exports: [TalhaoSoloService],
})
export class TalhaoSoloModule {}
