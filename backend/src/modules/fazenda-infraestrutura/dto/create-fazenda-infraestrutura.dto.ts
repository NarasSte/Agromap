import { IsNumber } from 'class-validator';

export class CreateFazendaInfraestruturaDto {
  @IsNumber()
  fazenda_id: number;

  @IsNumber()
  infraestrutura_id: number;
}
