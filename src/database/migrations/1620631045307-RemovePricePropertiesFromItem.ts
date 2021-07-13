import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePricePropertiesFromItem1620631045307
  implements MigrationInterface
{
  name = 'RemovePricePropertiesFromItem1620631045307';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_6f204c02cb60cec5f2db151d93` ON `item`'
    );
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `originalPrice`');
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `sellPrice`');
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `displayPrice`');
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `priceUnit`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `item` ADD `priceUnit` enum ('KRW', 'USD', 'JPY', 'CNY', 'EUR', 'GBP', 'AUD', 'CAD') NOT NULL DEFAULT 'KRW'"
    );
    await queryRunner.query('ALTER TABLE `item` ADD `displayPrice` int NULL');
    await queryRunner.query('ALTER TABLE `item` ADD `sellPrice` int NOT NULL');
    await queryRunner.query(
      'ALTER TABLE `item` ADD `originalPrice` int NOT NULL'
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_6f204c02cb60cec5f2db151d93` ON `item` (`sellPrice`)'
    );
  }
}
