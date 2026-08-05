import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoloService } from './solo.service';
import { SoloController } from './solo.controller';
import { Solo } from '../../entities/solo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Solo])],
  controllers: [SoloController],
  providers: [SoloService],
  exports: [SoloService],
})
export class SoloModule {}
