import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Talhao } from './talhao.entity';
import { Cultura } from './cultura.entity';

@Entity('plantio')
export class Plantio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  talhao_id: number;

  @Column()
  cultura_id: number;

  @Column({ type: 'date' })
  data_plantio: Date;

  @Column({ type: 'date', nullable: true })
  data_prevista_colheita: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  espacamento_metros: number;

  @Column({ nullable: true })
  sementes_por_hectare: number;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @ManyToOne(() => Talhao, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'talhao_id' })
  talhao: Talhao;

  @ManyToOne(() => Cultura, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'cultura_id' })
  cultura: Cultura;
}
