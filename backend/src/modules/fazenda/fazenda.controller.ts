import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FazendaService } from './fazenda.service';
import { CadastroFazendaDto } from './dto/cadastro-fazenda.dto';
import { UpdateFazendaDto } from './dto/update-fazenda.dto';
import { TipoUsuario } from '../../entities/usuario.entity';
import { UsuarioService } from '../auth/usuario.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/auth.types';

@Controller('fazendas')
export class FazendaController {
  constructor(
    private readonly fazendaService: FazendaService,
    private readonly usuarioService: UsuarioService,
  ) {}

  @Post()
  async create(@Body() cadastroFazendaDto: CadastroFazendaDto) {
    const { senha, ...createFazendaDto } = cadastroFazendaDto;
    if (senha) {
      if (!createFazendaDto.email) {
        throw new BadRequestException('Informe o e-mail para criar o acesso da fazenda');
      }
      await this.usuarioService.assertEmailDisponivel(createFazendaDto.email);
    }
    const fazenda = await this.fazendaService.create(createFazendaDto);
    if (senha) {
      await this.usuarioService.create({
        nome: createFazendaDto.proprietario_nome || createFazendaDto.nome,
        email: createFazendaDto.email!,
        senha,
        tipo: TipoUsuario.FAZENDA,
        fazenda_id: fazenda.id,
      });
    }
    return fazenda;
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TipoUsuario.ADMIN)
  findAll() {
    return this.fazendaService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    FazendaController.assertPodeAcessar(user, id);
    return this.fazendaService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFazendaDto: UpdateFazendaDto,
    @CurrentUser() user: JwtPayload,
  ) {
    FazendaController.assertPodeAcessar(user, id);
    return this.fazendaService.update(id, updateFazendaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TipoUsuario.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fazendaService.remove(id);
  }

  static assertPodeAcessar(user: JwtPayload, fazendaId: number): void {
    if (user.tipo === TipoUsuario.ADMIN) return;
    if (user.tipo === TipoUsuario.FAZENDA && user.fazenda_id === fazendaId) return;
    throw new ForbiddenException('Você só pode acessar a sua própria fazenda');
  }
}
