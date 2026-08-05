import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Talhao } from './talhao.entity';
import { Plantio } from './plantio.entity';

@Entity('irrigacao')
export class Irrigacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  talhao_id: number;

  @Column({ nullable: true })
  plantio_id: number;

  @Column({ type: 'datetime' })
  data_irrigacao: Date;

  @Column({ length: 50 })
  tipo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  volume_m3: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  duracao_horas: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  custo_energia: number;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @ManyToOne(() => Talhao, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'talhao_id' })
  talhao: Talhao;

  @ManyToOne(() => Plantio, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'plantio_id' })
  plantio: Plantio;
}
