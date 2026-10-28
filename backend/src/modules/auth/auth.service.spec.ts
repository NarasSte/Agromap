import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsuarioService } from './usuario.service';
import { TipoUsuario, Usuario } from '../../entities/usuario.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usuarioService: { findByEmailWithSenha: jest.Mock; findOne: jest.Mock };
  let jwtService: { signAsync: jest.Mock };

  const buildUsuario = async (overrides: Partial<Usuario> = {}) =>
    ({
      id: 7,
      nome: 'Produtor',
      email: 'produtor@fazenda.com',
      senha_hash: await bcrypt.hash('segredo123', 4),
      tipo: TipoUsuario.FAZENDA,
      fazenda_id: 3,
      ...overrides,
    }) as Usuario;

  beforeEach(async () => {
    usuarioService = { findByEmailWithSenha: jest.fn(), findOne: jest.fn() };
    jwtService = { signAsync: jest.fn().mockResolvedValue('token') };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsuarioService, useValue: usuarioService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('returns a token and the public user data on valid credentials', async () => {
    usuarioService.findByEmailWithSenha.mockResolvedValue(await buildUsuario());

    const result = await service.login('produtor@fazenda.com', 'segredo123');

    expect(result).toEqual({
      access_token: 'token',
      usuario: {
        id: 7,
        nome: 'Produtor',
        email: 'produtor@fazenda.com',
        tipo: TipoUsuario.FAZENDA,
        fazenda_id: 3,
      },
    });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 7,
      email: 'produtor@fazenda.com',
      tipo: TipoUsuario.FAZENDA,
      fazenda_id: 3,
    });
  });

  it('rejects an unknown e-mail', async () => {
    usuarioService.findByEmailWithSenha.mockResolvedValue(null);

    await expect(service.login('x@x.com', 'segredo123')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects a wrong password', async () => {
    usuarioService.findByEmailWithSenha.mockResolvedValue(await buildUsuario());

    await expect(service.login('produtor@fazenda.com', 'errada')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });
});
