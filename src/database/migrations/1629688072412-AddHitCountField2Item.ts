import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHitCountField2Item1629688072412 implements MigrationInterface {
  name = 'AddHitCountField2Item1629688072412';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `item` ADD `hitCount` mediumint UNSIGNED NOT NULL DEFAULT '0'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `hitCount`');
  }
}
