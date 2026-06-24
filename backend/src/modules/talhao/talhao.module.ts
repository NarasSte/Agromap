import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TalhaoService } from './talhao.service';
import { TalhaoController } from './talhao.controller';
import { Talhao } from '../../entities/talhao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Talhao])],
  controllers: [TalhaoController],
  providers: [TalhaoService],
  exports: [TalhaoService],
})
export class TalhaoModule {}
