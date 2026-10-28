import { ForbiddenException } from '@nestjs/common';
import { FazendaController } from './fazenda.controller';
import { FazendaService } from './fazenda.service';
import { UsuarioService } from '../auth/usuario.service';
import { TipoUsuario } from '../../entities/usuario.entity';
import { JwtPayload } from '../auth/auth.types';

describe('FazendaController', () => {
  let controller: FazendaController;
  let fazendaService: { create: jest.Mock; findOne: jest.Mock };
  let usuarioService: { assertEmailDisponivel: jest.Mock; create: jest.Mock };

  const admin: JwtPayload = { sub: 1, email: 'a@a.com', tipo: TipoUsuario.ADMIN, fazenda_id: null };
  const dono: JwtPayload = { sub: 2, email: 'f@f.com', tipo: TipoUsuario.FAZENDA, fazenda_id: 5 };

  beforeEach(() => {
    fazendaService = {
      create: jest.fn().mockResolvedValue({ id: 5, nome: 'Boa Vista' }),
      findOne: jest.fn().mockResolvedValue({ id: 5 }),
    };
    usuarioService = { assertEmailDisponivel: jest.fn(), create: jest.fn() };
    controller = new FazendaController(
      fazendaService as unknown as FazendaService,
      usuarioService as unknown as UsuarioService,
    );
  });

  it('creates the fazenda access user when a password is sent', async () => {
    await controller.create({
      nome: 'Boa Vista',
      proprietario_nome: 'João',
      email: 'joao@fazenda.com',
      senha: 'segredo123',
    });

    expect(fazendaService.create).toHaveBeenCalledWith({
      nome: 'Boa Vista',
      proprietario_nome: 'João',
      email: 'joao@fazenda.com',
    });
    expect(usuarioService.assertEmailDisponivel).toHaveBeenCalledWith('joao@fazenda.com');
    expect(usuarioService.create).toHaveBeenCalledWith({
      nome: 'João',
      email: 'joao@fazenda.com',
      senha: 'segredo123',
      tipo: TipoUsuario.FAZENDA,
      fazenda_id: 5,
    });
  });

  it('does not create a user without a password', async () => {
    await controller.create({ nome: 'Boa Vista' });

    expect(usuarioService.create).not.toHaveBeenCalled();
  });

  it('lets admins and the owner read a fazenda', async () => {
    await expect(controller.findOne(5, admin)).resolves.toEqual({ id: 5 });
    await expect(controller.findOne(5, dono)).resolves.toEqual({ id: 5 });
  });

  it('forbids a fazenda user from reading another fazenda', () => {
    expect(() => controller.findOne(6, dono)).toThrow(ForbiddenException);
    expect(fazendaService.findOne).not.toHaveBeenCalled();
  });
});
