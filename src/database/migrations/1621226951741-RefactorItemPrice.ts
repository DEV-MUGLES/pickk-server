import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorItemPrice1621226951741 implements MigrationInterface {
  name = 'RefactorItemPrice1621226951741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_price` ADD `isActive` tinyint NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item_price` ADD `isCrawlUpdating` tinyint NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item_price` ADD `isBase` tinyint NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item_price` ADD `startAt` datetime NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item_price` ADD `endAt` datetime NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item_price` ADD `displayPrice` int NULL'
    );
    await queryRunner.query(
      "ALTER TABLE `item_price` ADD `unit` enum ('KRW', 'USD', 'JPY', 'CNY', 'EUR', 'GBP', 'AUD', 'CAD') NOT NULL DEFAULT 'KRW'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `item_price` DROP COLUMN `unit`');
    await queryRunner.query(
      'ALTER TABLE `item_price` DROP COLUMN `displayPrice`'
    );
    await queryRunner.query('ALTER TABLE `item_price` DROP COLUMN `endAt`');
    await queryRunner.query('ALTER TABLE `item_price` DROP COLUMN `startAt`');
    await queryRunner.query('ALTER TABLE `item_price` DROP COLUMN `isBase`');
    await queryRunner.query(
      'ALTER TABLE `item_price` DROP COLUMN `isCrawlUpdating`'
    );
    await queryRunner.query('ALTER TABLE `item_price` DROP COLUMN `isActive`');
  }
}
