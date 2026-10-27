import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../../entities/usuario.entity';
import { Fazenda } from '../../entities/fazenda.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Fazenda]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET não configurado. Defina a variável no arquivo .env');
        }
        return {
          secret,
          signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '8h' },
        };
      },
    }),
  ],
  controllers: [AuthController, UsuarioController],
  providers: [AuthService, UsuarioService, JwtAuthGuard, RolesGuard],
  exports: [JwtModule, UsuarioService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
