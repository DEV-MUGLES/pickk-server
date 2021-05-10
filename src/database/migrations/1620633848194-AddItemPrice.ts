import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemPrice1620633848194 implements MigrationInterface {
  name = 'AddItemPrice1620633848194';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `item_price` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `originalPrice` mediumint UNSIGNED NOT NULL, `sellPrice` mediumint UNSIGNED NOT NULL, `finalPrice` mediumint UNSIGNED NOT NULL, `pickkDiscountAmount` mediumint UNSIGNED NOT NULL, `pickkDiscountRate` mediumint UNSIGNED NOT NULL, `itemId` int NOT NULL, INDEX `idx_sellPrice` (`sellPrice`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `item_price` ADD CONSTRAINT `FK_f8046453707754686bb1775ef71` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_price` DROP FOREIGN KEY `FK_f8046453707754686bb1775ef71`'
    );
    await queryRunner.query('DROP INDEX `idx_sellPrice` ON `item_price`');
    await queryRunner.query('DROP TABLE `item_price`');
  }
}
