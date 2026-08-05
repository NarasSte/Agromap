import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Equipamento } from './equipamento.entity';

@Entity('manutencao_equipamento')
export class ManutencaoEquipamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  equipamento_id: number;

  @Column({ type: 'date' })
  data_manutencao: Date;

  @Column({ length: 50, nullable: true })
  tipo: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  custo: number;

  @Column({ nullable: true })
  horas_parado: number;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @ManyToOne(() => Equipamento, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'equipamento_id' })
  equipamento: Equipamento;
}
