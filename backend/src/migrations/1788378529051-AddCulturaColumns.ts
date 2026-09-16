import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCulturaColumns1788378529051 implements MigrationInterface {
  name = 'AddCulturaColumns1788378529051';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE cultura
        ADD COLUMN tipo VARCHAR(50) NULL,
        ADD COLUMN area DECIMAL(10, 2) NULL,
        ADD COLUMN talhoes INT NULL,
        ADD COLUMN dias_colheita INT NULL,
        ADD COLUMN desenvolvimento INT NULL,
        ADD COLUMN status VARCHAR(50) NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE cultura
        DROP COLUMN status,
        DROP COLUMN desenvolvimento,
        DROP COLUMN dias_colheita,
        DROP COLUMN talhoes,
        DROP COLUMN area,
        DROP COLUMN tipo;`,
    );
  }
}
