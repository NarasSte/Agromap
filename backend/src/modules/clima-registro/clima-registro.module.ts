import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClimaRegistroService } from './clima-registro.service';
import { ClimaRegistroController } from './clima-registro.controller';
import { ClimaRegistro } from '../../entities/clima-registro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClimaRegistro])],
  controllers: [ClimaRegistroController],
  providers: [ClimaRegistroService],
  exports: [ClimaRegistroService],
})
export class ClimaRegistroModule {}
