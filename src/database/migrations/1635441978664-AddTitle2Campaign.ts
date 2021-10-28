import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTitle2Campaign1635441978664 implements MigrationInterface {
  name = 'AddTitle2Campaign1635441978664';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `campaign` ADD `title` varchar(255) NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `campaign` DROP COLUMN `title`');
  }
}
