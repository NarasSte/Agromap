import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Talhao } from './talhao.entity';
import { Solo } from './solo.entity';

@Entity('talhao_solo')
export class TalhaoSolo {
  @PrimaryColumn()
  talhao_id: number;

  @PrimaryColumn()
  solo_id: number;

  @Column({ type: 'date', nullable: true })
  data_amostragem: Date;

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
  profundidade_cm: number;

  @ManyToOne(() => Talhao, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'talhao_id' })
  talhao: Talhao;

  @ManyToOne(() => Solo, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'solo_id' })
  solo: Solo;
}
