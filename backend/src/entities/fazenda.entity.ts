import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('fazenda')
export class Fazenda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nome: string;

  @Column({ length: 255, nullable: true })
  proprietario_nome: string;

  @Column({ length: 50, nullable: true })
  documento: string;

  @Column({ length: 20, nullable: true })
  telefone: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  endereco: string;

  @Column({ length: 100, nullable: true })
  cidade: string;

  @Column({ length: 50, nullable: true })
  estado: string;

  @Column({ length: 20, nullable: true })
  cep: string;

  @Column({ length: 50, default: 'Brasil' })
  pais: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  area_total_hectares: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  area_produtiva_hectares: number;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  data_cadastro: Date;

  @Column({ length: 255, nullable: true })
  bairro: string;

  @Column({ nullable: true })
  numero: number;
}
