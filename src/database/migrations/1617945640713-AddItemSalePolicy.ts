import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemSalePolicy1617945640713 implements MigrationInterface {
  name = 'AddItemSalePolicy1617945640713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `item_sale_policy` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `isUsingStock` tinyint NOT NULL, `quantityLimit` tinyint UNSIGNED NOT NULL, `isUsingQuantityLimit` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query('ALTER TABLE `item` ADD `salePolicyId` int NULL');
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_b035f04726e12394e3f1d9bb38` ON `item` (`salePolicyId`)'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_b035f04726e12394e3f1d9bb388` FOREIGN KEY (`salePolicyId`) REFERENCES `item_sale_policy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_b035f04726e12394e3f1d9bb388`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_b035f04726e12394e3f1d9bb38` ON `item`'
    );
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `salePolicyId`');
    await queryRunner.query('DROP TABLE `item_sale_policy`');
  }
}
