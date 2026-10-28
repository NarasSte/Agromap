import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../../entities/usuario.entity';
import { UsuarioService } from './usuario.service';
import { JwtPayload, UsuarioPublico } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, senha: string): Promise<{ access_token: string; usuario: UsuarioPublico }> {
    const usuario = await this.usuarioService.findByEmailWithSenha(email);
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha_hash))) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }
    const payload: JwtPayload = {
      sub: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo,
      fazenda_id: usuario.fazenda_id,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      usuario: AuthService.toPublico(usuario),
    };
  }

  async me(id: number): Promise<UsuarioPublico> {
    return AuthService.toPublico(await this.usuarioService.findOne(id));
  }

  static toPublico(usuario: Usuario): UsuarioPublico {
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      fazenda_id: usuario.fazenda_id,
    };
  }
}
