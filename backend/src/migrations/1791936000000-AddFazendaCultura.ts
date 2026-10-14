import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFazendaCultura1791936000000 implements MigrationInterface {
  name = 'AddFazendaCultura1791936000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE fazenda_cultura (
        fazenda_id INT NOT NULL,
        codigo VARCHAR(50) NOT NULL,
        PRIMARY KEY (fazenda_id, codigo),
        CONSTRAINT fk_fazenda_cultura_fazenda FOREIGN KEY (fazenda_id)
          REFERENCES fazenda (id) ON DELETE CASCADE
      );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE fazenda_cultura;`);
  }
}
