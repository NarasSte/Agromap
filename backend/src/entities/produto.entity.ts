import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('produto')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nome: string;

  @Column({ length: 50 })
  tipo: string;

  @Column({ length: 255, nullable: true })
  principio_ativo: string;

  @Column({ length: 255, nullable: true })
  fabricante: string;

  @Column({ length: 100, nullable: true })
  classe_agronomica: string;

  @Column({ length: 50, nullable: true })
  toxicidade: string;

  @Column({ nullable: true })
  intervalo_seguranca_padrao: number;

  @Column({ length: 100, nullable: true })
  registro_mapa: string;
}
