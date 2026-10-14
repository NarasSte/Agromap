import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { FazendaInfraestrutura } from './fazenda-infraestrutura.entity';

@Entity('infraestrutura')
export class Infraestrutura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  codigo: string;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 255, nullable: true })
  descricao: string;

  @OneToMany(() => FazendaInfraestrutura, (fi) => fi.infraestrutura)
  fazendas: FazendaInfraestrutura[];
}
