import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { UsuarioService } from './usuario.service';
import { TipoUsuario, Usuario } from '../../entities/usuario.entity';
import { Fazenda } from '../../entities/fazenda.entity';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let usuarioRepository: Record<string, jest.Mock>;
  let fazendaRepository: Record<string, jest.Mock>;
  let config: Record<string, string | undefined>;

  beforeEach(async () => {
    usuarioRepository = {
      exists: jest.fn().mockResolvedValue(false),
      create: jest.fn((data) => data),
      save: jest.fn((data) => Promise.resolve({ id: 1, ...data })),
      findOne: jest.fn((opts) => Promise.resolve({ id: opts.where.id } as Usuario)),
      find: jest.fn(),
      remove: jest.fn(),
    };
    fazendaRepository = { exists: jest.fn().mockResolvedValue(true) };
    config = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        { provide: getRepositoryToken(Usuario), useValue: usuarioRepository },
        { provide: getRepositoryToken(Fazenda), useValue: fazendaRepository },
        { provide: ConfigService, useValue: { get: (key: string) => config[key] } },
      ],
    }).compile();
    service = module.get(UsuarioService);
  });

  it('hashes the password and normalizes the e-mail', async () => {
    await service.create({
      nome: 'Produtor',
      email: 'Produtor@Fazenda.com',
      senha: 'segredo123',
      tipo: TipoUsuario.FAZENDA,
      fazenda_id: 3,
    });

    const saved = usuarioRepository.save.mock.calls[0][0];
    expect(saved.email).toBe('produtor@fazenda.com');
    expect(saved.fazenda_id).toBe(3);
    expect(saved.senha_hash).not.toBe('segredo123');
    await expect(bcrypt.compare('segredo123', saved.senha_hash)).resolves.toBe(true);
  });

  it('rejects a duplicated e-mail', async () => {
    usuarioRepository.exists.mockResolvedValue(true);

    await expect(
      service.create({ nome: 'A', email: 'a@a.com', senha: '123456', tipo: TipoUsuario.ADMIN }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('requires an existing fazenda for fazenda users', async () => {
    await expect(
      service.create({ nome: 'A', email: 'a@a.com', senha: '123456', tipo: TipoUsuario.FAZENDA }),
    ).rejects.toBeInstanceOf(BadRequestException);

    fazendaRepository.exists.mockResolvedValue(false);
    await expect(
      service.create({
        nome: 'A',
        email: 'a@a.com',
        senha: '123456',
        tipo: TipoUsuario.FAZENDA,
        fazenda_id: 99,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('does not link admins to a fazenda', async () => {
    await service.create({
      nome: 'Admin',
      email: 'admin@agromap.com',
      senha: '123456',
      tipo: TipoUsuario.ADMIN,
      fazenda_id: 3,
    });

    expect(usuarioRepository.save.mock.calls[0][0].fazenda_id).toBeNull();
  });

  it('seeds the initial admin from the environment only once', async () => {
    config = { ADMIN_EMAIL: 'admin@agromap.com', ADMIN_PASSWORD: 'admin123' };

    await service.onApplicationBootstrap();
    expect(usuarioRepository.save).toHaveBeenCalledTimes(1);
    expect(usuarioRepository.save.mock.calls[0][0].tipo).toBe(TipoUsuario.ADMIN);

    usuarioRepository.exists.mockResolvedValue(true);
    await service.onApplicationBootstrap();
    expect(usuarioRepository.save).toHaveBeenCalledTimes(1);
  });
});
