import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfraestruturaService } from './infraestrutura.service';
import { InfraestruturaController } from './infraestrutura.controller';
import { Infraestrutura } from '../../entities/infraestrutura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Infraestrutura])],
  controllers: [InfraestruturaController],
  providers: [InfraestruturaService],
  exports: [InfraestruturaService],
})
export class InfraestruturaModule {}
