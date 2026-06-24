import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Fazenda } from './fazenda.entity';

@Entity('talhao')
export class Talhao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nome: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  area_hectares: number;

  @Column()
  fazenda_id: number;

  @ManyToOne(() => Fazenda, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fazenda_id' })
  fazenda: Fazenda;
}
