import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Talhao } from './talhao.entity';

@Entity('previsao_climatica')
export class PrevisaoClimatica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  talhao_id: number;

  @Column({ type: 'datetime' })
  data_hora_inicio: Date;

  @Column({ type: 'datetime' })
  data_hora_fim: Date;

  @Column({ length: 50, default: 'OpenWeatherMap' })
  fonte: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperatura_media: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperatura_min: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperatura_max: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  umidade_media: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  precipitacao_total_mm: number;

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
  probabilidade_precipitacao_percent: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  velocidade_vento_kmh: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  rajada_vento_kmh: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  direcao_vento_graus: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  indice_uv: number;

  @Column({ type: 'json', nullable: true })
  dados_brutos_json: any;

  @ManyToOne(() => Talhao, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'talhao_id' })
  talhao: Talhao;
}
