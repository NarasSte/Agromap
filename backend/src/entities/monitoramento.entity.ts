import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Talhao } from './talhao.entity';
import { Plantio } from './plantio.entity';

@Entity('monitoramento')
export class Monitoramento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  talhao_id: number;

  @Column({ nullable: true })
  plantio_id: number;

  @Column({ type: 'datetime' })
  data_monitoramento: Date;

  @Column({ length: 50 })
  tipo: string;

  @Column({ length: 255, nullable: true })
  nome_alvo: string;

  @Column({ length: 50, nullable: true })
  nivel_infestacao: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  area_afetada: number;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'text', nullable: true })
  imagem_url: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @ManyToOne(() => Talhao, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'talhao_id' })
  talhao: Talhao;

  @ManyToOne(() => Plantio, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'plantio_id' })
  plantio: Plantio;
}
