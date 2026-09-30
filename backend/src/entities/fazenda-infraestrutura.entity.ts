import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Fazenda } from './fazenda.entity';
import { Infraestrutura } from './infraestrutura.entity';

@Entity('fazenda_infraestrutura')
export class FazendaInfraestrutura {
  @PrimaryColumn()
  fazenda_id: number;

  @PrimaryColumn()
  infraestrutura_id: number;

  @ManyToOne(() => Fazenda, (fazenda) => fazenda.infraestruturas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fazenda_id' })
  fazenda: Fazenda;

  @ManyToOne(() => Infraestrutura, (infraestrutura) => infraestrutura.fazendas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'infraestrutura_id' })
  infraestrutura: Infraestrutura;
}
