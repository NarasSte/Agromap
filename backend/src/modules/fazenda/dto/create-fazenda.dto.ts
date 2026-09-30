import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFazendaDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsOptional()
  @IsString()
  proprietario_nome?: string;

  @IsOptional()
  @IsString()
  documento?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  cep?: string;

  @IsOptional()
  @IsString()
  pais?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsNumber()
  area_total_hectares?: number;

  @IsOptional()
  @IsNumber()
  area_produtiva_hectares?: number;

  @IsOptional()
  @IsString()
  bairro?: string;

  @IsOptional()
  @IsNumber()
  numero?: number;

  @IsOptional()
  @IsString()
  car?: string;

  @IsOptional()
  @IsString()
  nirf_incra?: string;

  @IsOptional()
  @IsNumber()
  altitude_metros?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  infraestruturas?: string[];
}
