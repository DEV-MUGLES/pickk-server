import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrder2DigestImage1631077688139 implements MigrationInterface {
  name = 'AddOrder2DigestImage1631077688139';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `digest_image` ADD `order` tinyint UNSIGNED NOT NULL DEFAULT '0'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `digest_image` DROP COLUMN `order`');
  }
}
