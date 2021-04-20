import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemProvidedCode1618910770239 implements MigrationInterface {
  name = 'AddItemProvidedCode1618910770239';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `isAvailable`');
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `isPurchasable`');
    await queryRunner.query(
      'ALTER TABLE `item` ADD `providedCode` varchar(100) NULL'
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_b4d06354b8b23c50033531a621` ON `item` (`providedCode`)'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD `isManaging` tinyint NOT NULL DEFAULT 1'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD `isMdRecommended` tinyint NOT NULL DEFAULT 1'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `isMdRecommended`');
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `isManaging`');
    await queryRunner.query(
      'DROP INDEX `IDX_b4d06354b8b23c50033531a621` ON `item`'
    );
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `providedCode`');
    await queryRunner.query(
      "ALTER TABLE `item` ADD `isPurchasable` tinyint NOT NULL DEFAULT '0'"
    );
    await queryRunner.query(
      "ALTER TABLE `item` ADD `isAvailable` tinyint NOT NULL DEFAULT '1'"
    );
  }
}
