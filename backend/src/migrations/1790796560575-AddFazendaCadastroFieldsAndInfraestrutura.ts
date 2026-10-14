import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFazendaCadastroFieldsAndInfraestrutura1790796560575 implements MigrationInterface {
  name = 'AddFazendaCadastroFieldsAndInfraestrutura1790796560575';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE fazenda
        ADD COLUMN car VARCHAR(60) NULL,
        ADD COLUMN nirf_incra VARCHAR(20) NULL,
        ADD COLUMN altitude_metros INT NULL;`,
    );

    await queryRunner.query(
      `CREATE TABLE infraestrutura (
        id INT AUTO_INCREMENT PRIMARY KEY,
        codigo VARCHAR(50) NOT NULL,
        nome VARCHAR(100) NOT NULL,
        descricao VARCHAR(255) NULL,
        UNIQUE KEY uq_infraestrutura_codigo (codigo)
      );`,
    );

    await queryRunner.query(
      `CREATE TABLE fazenda_infraestrutura (
        fazenda_id INT NOT NULL,
        infraestrutura_id INT NOT NULL,
        PRIMARY KEY (fazenda_id, infraestrutura_id),
        CONSTRAINT fk_fazenda_infra_fazenda FOREIGN KEY (fazenda_id)
          REFERENCES fazenda (id) ON DELETE CASCADE,
        CONSTRAINT fk_fazenda_infra_infraestrutura FOREIGN KEY (infraestrutura_id)
          REFERENCES infraestrutura (id) ON DELETE CASCADE
      );`,
    );

    await queryRunner.query(
      `INSERT INTO infraestrutura (codigo, nome, descricao) VALUES
        ('irrigacao', 'Irrigação', 'Sistema de irrigação disponível na propriedade'),
        ('armazem', 'Armazém', 'Armazém ou silo para armazenamento de grãos'),
        ('maquinas', 'Maquinário', 'Tratores e implementos agrícolas próprios'),
        ('energia', 'Energia Elétrica', 'Acesso à rede elétrica na propriedade'),
        ('agua', 'Rio / Açude', 'Fonte de água disponível na propriedade'),
        ('estrada', 'Acesso Rural', 'Estrada de acesso à propriedade');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE fazenda_infraestrutura;`);
    await queryRunner.query(`DROP TABLE infraestrutura;`);
    await queryRunner.query(
      `ALTER TABLE fazenda
        DROP COLUMN altitude_metros,
        DROP COLUMN nirf_incra,
        DROP COLUMN car;`,
    );
  }
}
