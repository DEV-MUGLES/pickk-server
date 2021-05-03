import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSellPriceReservation1620021015404
  implements MigrationInterface {
  name = 'AddSellPriceReservation1620021015404';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `sell_price_reservation` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `isActive` tinyint NOT NULL, `destSellPrice` mediumint UNSIGNED NOT NULL, `isRollbackByCrawl` tinyint NOT NULL, `rollbackSellPrice` mediumint UNSIGNED NOT NULL, `startAt` timestamp NULL, `endAt` timestamp NULL, INDEX `IDX_983418127b59659059695594a2` (`isActive`, `endAt`), INDEX `IDX_cefc52f0648b237ad5686a4384` (`isActive`, `startAt`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD `sellPriceReservationId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD UNIQUE INDEX `IDX_bb163c42a7c9e670279e0688ab` (`sellPriceReservationId`)'
    );
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `originalPrice`');
    await queryRunner.query(
      'ALTER TABLE `item` ADD `originalPrice` mediumint UNSIGNED NOT NULL'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_6f204c02cb60cec5f2db151d93` ON `item`'
    );
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `sellPrice`');
    await queryRunner.query(
      'ALTER TABLE `item` ADD `sellPrice` mediumint UNSIGNED NOT NULL'
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_6f204c02cb60cec5f2db151d93` ON `item` (`sellPrice`)'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_bb163c42a7c9e670279e0688ab` ON `item` (`sellPriceReservationId`)'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_bb163c42a7c9e670279e0688abd` FOREIGN KEY (`sellPriceReservationId`) REFERENCES `sell_price_reservation`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_bb163c42a7c9e670279e0688abd`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_bb163c42a7c9e670279e0688ab` ON `item`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_6f204c02cb60cec5f2db151d93` ON `item`'
    );
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `sellPrice`');
    await queryRunner.query('ALTER TABLE `item` ADD `sellPrice` int NOT NULL');
    await queryRunner.query(
      'CREATE INDEX `IDX_6f204c02cb60cec5f2db151d93` ON `item` (`sellPrice`)'
    );
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `originalPrice`');
    await queryRunner.query(
      'ALTER TABLE `item` ADD `originalPrice` int NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP INDEX `IDX_bb163c42a7c9e670279e0688ab`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP COLUMN `sellPriceReservationId`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_cefc52f0648b237ad5686a4384` ON `sell_price_reservation`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_983418127b59659059695594a2` ON `sell_price_reservation`'
    );
    await queryRunner.query('DROP TABLE `sell_price_reservation`');
  }
}
