import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrder2LookImage1631561580421 implements MigrationInterface {
  name = 'AddOrder2LookImage1631561580421';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `look_image` ADD `order` tinyint UNSIGNED NOT NULL DEFAULT '0'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `look_image` DROP COLUMN `order`');
  }
}
