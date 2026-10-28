import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';
import { TipoUsuario } from '../../../entities/usuario.entity';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsEnum(TipoUsuario)
  tipo: TipoUsuario;

  @ValidateIf((o: CreateUsuarioDto) => o.tipo === TipoUsuario.FAZENDA)
  @IsInt()
  fazenda_id?: number;
}
