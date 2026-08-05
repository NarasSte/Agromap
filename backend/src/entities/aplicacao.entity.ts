import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Talhao } from './talhao.entity';
import { Plantio } from './plantio.entity';
import { Monitoramento } from './monitoramento.entity';
import { Produto } from './produto.entity';

@Entity('aplicacao')
export class Aplicacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  talhao_id: number;

  @Column({ nullable: true })
  plantio_id: number;

  @Column({ nullable: true })
  monitoramento_id: number;

  @Column()
  produto_id: number;

  @Column({ type: 'datetime' })
  data_aplicacao: Date;

  @Column({ length: 50 })
  tipo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  dose: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  volume_calda: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  area_tratada: number;

  @Column({ length: 100, nullable: true })
  equipamento: string;

  @Column({ length: 255, nullable: true })
  operador: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperatura_celsius: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  umidade_relativa_percent: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  velocidade_vento_kmh: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  precipitacao_mm: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  delta_t_celsius: number;

  @Column({ type: 'decimal', precision: 5, scale: 3, nullable: true })
  vpd_kpa: number;

  @Column({ type: 'text', nullable: true })
  condicoes_climaticas: string;

  @Column({ nullable: true })
  intervalo_seguranca: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  custo_estimado: number;

  @ManyToOne(() => Talhao, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'talhao_id' })
  talhao: Talhao;

  @ManyToOne(() => Plantio, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'plantio_id' })
  plantio: Plantio;

  @ManyToOne(() => Monitoramento, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'monitoramento_id' })
  monitoramento: Monitoramento;

  @ManyToOne(() => Produto, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;
}
