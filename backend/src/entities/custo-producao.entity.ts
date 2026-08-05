import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Plantio } from './plantio.entity';

@Entity('custo_producao')
export class CustoProducao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plantio_id: number;

  @Column({ length: 9, nullable: true })
  safra_ano: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  custo_insumos: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  custo_mao_obra_direta: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  custo_operacional_maquinas: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  custo_irrigacao: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  outros_custos: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  custo_total_producao: number;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @ManyToOne(() => Plantio, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plantio_id' })
  plantio: Plantio;
}
