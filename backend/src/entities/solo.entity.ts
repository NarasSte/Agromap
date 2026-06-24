import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('solo')
export class Solo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 50, nullable: true })
  textura: string;

  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  capacidade_campo_m3_m3: number;

  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  ponto_murcha_m3_m3: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  densidade_solo_g_cm3: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  materia_organica_percent: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  ph_agua: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  condutividade_eletrica_ds_m: number;

  @Column({ type: 'text', nullable: true })
  descricao: string;
}
