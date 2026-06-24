import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Talhao } from './talhao.entity';

@Entity('clima_registro')
export class ClimaRegistro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  talhao_id: number;

  @Column({ type: 'datetime' })
  data: Date;

  @Column({ length: 50, default: 'OpenWeatherMap' })
  fonte: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperatura: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  umidade_relativa: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  umidade_solo_percent: number;

  @Column({ type: 'decimal', precision: 7, scale: 2, nullable: true })
  pressao_hpa: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  velocidade_vento_kmh: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  direcao_vento_graus: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  rajada_vento_kmh: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  precipitacao_mm: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  precipitacao_acumulada_24h: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  radiacao_solar_w_m2: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  delta_t_celsius: number;

  @Column({ type: 'decimal', precision: 5, scale: 3, nullable: true })
  vpd_kpa: number;

  @Column({ type: 'json', nullable: true })
  dados_brutos_json: any;

  @ManyToOne(() => Talhao, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'talhao_id' })
  talhao: Talhao;
}
