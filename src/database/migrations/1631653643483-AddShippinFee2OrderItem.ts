import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddShippinFee2OrderItem1631653643483
  implements MigrationInterface
{
  name = 'AddShippinFee2OrderItem1631653643483';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `withdrawnAt`'
    );

    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `isFreeShippingPackage` tinyint NOT NULL DEFAULT 0'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` CHANGE `isFreeShippingPackage` `isFreeShippingPackage` tinyint NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `shippingFee` int UNSIGNED NOT NULL DEFAULT 0'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` CHANGE `shippingFee` `shippingFee` int UNSIGNED NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `shippingFee`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `isFreeShippingPackage`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `withdrawnAt` datetime NULL'
    );
  }
}
