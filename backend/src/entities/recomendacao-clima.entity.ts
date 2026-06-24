import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('recomendacao_clima')
export class RecomendacaoClima {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 50, nullable: true })
  tipo_recomendacao: string;

  @Column({ type: 'json' })
  condicao: any;

  @Column({ type: 'text', nullable: true })
  acao: string;

  @Column({ default: 1 })
  prioridade: number;

  @Column({ default: 1 })
  ativo: boolean;
}
