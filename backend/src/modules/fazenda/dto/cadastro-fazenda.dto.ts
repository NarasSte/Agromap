import { IsOptional, IsString, MinLength } from 'class-validator';
import { CreateFazendaDto } from './create-fazenda.dto';

export class CadastroFazendaDto extends CreateFazendaDto {
  @IsOptional()
  @IsString()
  @MinLength(6)
  senha?: string;
}
