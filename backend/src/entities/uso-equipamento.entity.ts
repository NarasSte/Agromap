import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Equipamento } from './equipamento.entity';
import { Aplicacao } from './aplicacao.entity';
import { Irrigacao } from './irrigacao.entity';
import { Plantio } from './plantio.entity';

@Entity('uso_equipamento')
export class UsoEquipamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  equipamento_id: number;

  @Column({ nullable: true })
  aplicacao_id: number;

  @Column({ nullable: true })
  irrigacao_id: number;

  @Column({ nullable: true })
  plantio_id: number;

  @Column({ type: 'datetime' })
  data_uso: Date;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  horas_trabalhadas: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  custo_operacional_hora: number;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @ManyToOne(() => Equipamento, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'equipamento_id' })
  equipamento: Equipamento;

  @ManyToOne(() => Aplicacao, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'aplicacao_id' })
  aplicacao: Aplicacao;

  @ManyToOne(() => Irrigacao, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'irrigacao_id' })
  irrigacao: Irrigacao;

  @ManyToOne(() => Plantio, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'plantio_id' })
  plantio: Plantio;
}
