import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { TipoUsuario, Usuario } from '../../entities/usuario.entity';
import { Fazenda } from '../../entities/fazenda.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class UsuarioService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UsuarioService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Fazenda)
    private readonly fazendaRepository: Repository<Fazenda>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const email = this.configService.get<string>('ADMIN_EMAIL');
    const senha = this.configService.get<string>('ADMIN_PASSWORD');
    if (!email || !senha) return;
    if (await this.usuarioRepository.exists({ where: { email: email.toLowerCase() } })) return;
    await this.create({
      nome: this.configService.get<string>('ADMIN_NOME') || 'Administrador',
      email,
      senha,
      tipo: TipoUsuario.ADMIN,
    });
    this.logger.log(`Usuário administrador inicial criado: ${email}`);
  }

  async assertEmailDisponivel(email: string): Promise<void> {
    if (await this.usuarioRepository.exists({ where: { email: email.toLowerCase() } })) {
      throw new ConflictException('Já existe um usuário cadastrado com este e-mail');
    }
  }

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const email = dto.email.toLowerCase();
    await this.assertEmailDisponivel(email);

    let fazendaId: number | null = null;
    if (dto.tipo === TipoUsuario.FAZENDA) {
      if (!dto.fazenda_id) {
        throw new BadRequestException('Usuários do tipo fazenda precisam de uma fazenda vinculada');
      }
      if (!(await this.fazendaRepository.exists({ where: { id: dto.fazenda_id } }))) {
        throw new NotFoundException(`Fazenda with ID ${dto.fazenda_id} not found`);
      }
      fazendaId = dto.fazenda_id;
    }

    const usuario = await this.usuarioRepository.save(
      this.usuarioRepository.create({
        nome: dto.nome,
        email,
        senha_hash: await bcrypt.hash(dto.senha, SALT_ROUNDS),
        tipo: dto.tipo,
        fazenda_id: fazendaId,
      }),
    );
    return this.findOne(usuario.id);
  }

  findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario with ID ${id} not found`);
    }
    return usuario;
  }

  findByEmailWithSenha(email: string): Promise<Usuario | null> {
    return this.usuarioRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.senha_hash')
      .where('usuario.email = :email', { email: email.toLowerCase() })
      .getOne();
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }
}
