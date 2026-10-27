import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Fazenda } from './fazenda.entity';

export enum TipoUsuario {
  ADMIN = 'admin',
  FAZENDA = 'fazenda',
}

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nome: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255, select: false })
  senha_hash: string;

  @Column({ type: 'enum', enum: TipoUsuario })
  tipo: TipoUsuario;

  @Column({ nullable: true })
  fazenda_id: number | null;

  @ManyToOne(() => Fazenda, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fazenda_id' })
  fazenda: Fazenda | null;

  @CreateDateColumn()
  data_cadastro: Date;
}
