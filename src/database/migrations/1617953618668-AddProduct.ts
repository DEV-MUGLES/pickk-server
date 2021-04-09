import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProduct1617953618668 implements MigrationInterface {
  name = 'AddProduct1617953618668';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `product` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `stock` smallint UNSIGNED NOT NULL DEFAULT '0', `itemId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `product_item_option_values_item_option_value` (`productId` int NOT NULL, `itemOptionValueId` int NOT NULL, INDEX `IDX_8bdee6d744c73248fcc7258b5f` (`productId`), INDEX `IDX_4625cd32527c50caa22d6c90b9` (`itemOptionValueId`), PRIMARY KEY (`productId`, `itemOptionValueId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `product` ADD CONSTRAINT `FK_eaad2f56c02ff99383ee85a1410` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `product_item_option_values_item_option_value` ADD CONSTRAINT `FK_8bdee6d744c73248fcc7258b5fd` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `product_item_option_values_item_option_value` ADD CONSTRAINT `FK_4625cd32527c50caa22d6c90b91` FOREIGN KEY (`itemOptionValueId`) REFERENCES `item_option_value`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `product_item_option_values_item_option_value` DROP FOREIGN KEY `FK_4625cd32527c50caa22d6c90b91`'
    );
    await queryRunner.query(
      'ALTER TABLE `product_item_option_values_item_option_value` DROP FOREIGN KEY `FK_8bdee6d744c73248fcc7258b5fd`'
    );
    await queryRunner.query(
      'ALTER TABLE `product` DROP FOREIGN KEY `FK_eaad2f56c02ff99383ee85a1410`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_4625cd32527c50caa22d6c90b9` ON `product_item_option_values_item_option_value`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_8bdee6d744c73248fcc7258b5f` ON `product_item_option_values_item_option_value`'
    );
    await queryRunner.query(
      'DROP TABLE `product_item_option_values_item_option_value`'
    );
    await queryRunner.query('DROP TABLE `product`');
  }
}
