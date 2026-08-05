import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cultura')
export class Cultura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 150, nullable: true })
  nome_cientifico: string;

  @Column({ nullable: true })
  ciclo_medio_dias: number;

  @Column({ nullable: true })
  graus_dia_acumulados: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  coeficiente_kc: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperatura_otima_min: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperatura_otima_max: number;
}
