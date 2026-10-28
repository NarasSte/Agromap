import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaService } from './cultura.service';
import { CulturaController } from './cultura.controller';
import { Cultura } from '../../entities/cultura.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cultura]), AuthModule],
  controllers: [CulturaController],
  providers: [CulturaService],
  exports: [CulturaService],
})
export class CulturaModule {}
