import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsuario1793100000000 implements MigrationInterface {
  name = 'AddUsuario1793100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE usuario (
        id INT NOT NULL AUTO_INCREMENT,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        tipo ENUM('admin', 'fazenda') NOT NULL,
        fazenda_id INT NULL,
        data_cadastro DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        UNIQUE KEY uq_usuario_email (email),
        CONSTRAINT fk_usuario_fazenda FOREIGN KEY (fazenda_id)
          REFERENCES fazenda (id) ON DELETE CASCADE
      );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE usuario;`);
  }
}
