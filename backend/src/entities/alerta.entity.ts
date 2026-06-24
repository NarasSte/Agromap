import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Talhao } from './talhao.entity';

@Entity('alerta')
export class Alerta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  talhao_id: number;

  @Column({ length: 50 })
  tipo: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ length: 20, nullable: true })
  nivel: string;

  @Column({ type: 'datetime' })
  data_geracao: Date;

  @Column({ length: 20, default: 'ativo' })
  status: string;

  @ManyToOne(() => Talhao, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'talhao_id' })
  talhao: Talhao;
}
