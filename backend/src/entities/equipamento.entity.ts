import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('equipamento')
export class Equipamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 50, nullable: true })
  tipo: string;

  @Column({ length: 50, nullable: true })
  marca: string;

  @Column({ length: 50, nullable: true })
  modelo: string;

  @Column({ type: 'date', nullable: true })
  data_aquisicao: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  valor_compra: number;

  @Column({ nullable: true })
  vida_util_horas: number;
}
