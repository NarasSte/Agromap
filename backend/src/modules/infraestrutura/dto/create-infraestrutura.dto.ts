import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInfraestruturaDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;
}
