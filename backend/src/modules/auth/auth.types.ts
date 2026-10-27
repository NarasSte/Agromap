import { TipoUsuario } from '../../entities/usuario.entity';

export interface JwtPayload {
  sub: number;
  email: string;
  tipo: TipoUsuario;
  fazenda_id: number | null;
}

export interface UsuarioPublico {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  fazenda_id: number | null;
}
