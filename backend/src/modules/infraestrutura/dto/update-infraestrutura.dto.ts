import { PartialType } from '@nestjs/mapped-types';
import { CreateInfraestruturaDto } from './create-infraestrutura.dto';

export class UpdateInfraestruturaDto extends PartialType(CreateInfraestruturaDto) {}
