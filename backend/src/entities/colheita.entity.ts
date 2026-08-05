import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Talhao } from './talhao.entity';
import { Plantio } from './plantio.entity';

@Entity('colheita')
export class Colheita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  talhao_id: number;

  @Column()
  plantio_id: number;

  @Column({ type: 'date' })
  data_colheita: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  area_colhida_hectares: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  producao_total_kg: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  umidade_percent: number;

  @Column({ length: 50, nullable: true })
  qualidade: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  perdas_kg: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  produtividade_kg_ha: number;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @ManyToOne(() => Talhao, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'talhao_id' })
  talhao: Talhao;

  @ManyToOne(() => Plantio, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'plantio_id' })
  plantio: Plantio;
}
