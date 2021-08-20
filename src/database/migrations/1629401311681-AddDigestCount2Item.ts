import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDigestCount2Item1629401311681 implements MigrationInterface {
  name = 'AddDigestCount2Item1629401311681';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `item` ADD `digestCount` mediumint UNSIGNED NOT NULL DEFAULT '0'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `digestCount`');
  }
}
