import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TipoUsuario } from '../../entities/usuario.entity';
import { JwtPayload } from './auth.types';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<TipoUsuario[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;
    const user: JwtPayload | undefined = context.switchToHttp().getRequest().user;
    if (!user || !roles.includes(user.tipo)) {
      throw new ForbiddenException('Acesso não permitido para este tipo de usuário');
    }
    return true;
  }
}
