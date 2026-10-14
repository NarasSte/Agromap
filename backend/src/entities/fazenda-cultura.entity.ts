import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Fazenda } from './fazenda.entity';

@Entity('fazenda_cultura')
export class FazendaCultura {
  @PrimaryColumn()
  fazenda_id: number;

  @PrimaryColumn({ length: 50 })
  codigo: string;

  @ManyToOne(() => Fazenda, (fazenda) => fazenda.culturas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fazenda_id' })
  fazenda: Fazenda;
}
