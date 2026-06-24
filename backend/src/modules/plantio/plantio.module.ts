import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantioService } from './plantio.service';
import { PlantioController } from './plantio.controller';
import { Plantio } from '../../entities/plantio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plantio])],
  controllers: [PlantioController],
  providers: [PlantioService],
  exports: [PlantioService],
})
export class PlantioModule {}
