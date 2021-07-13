import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorProductShippingReservePolicy1621306571489
  implements MigrationInterface
{
  name = 'RefactorProductShippingReservePolicy1621306571489';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `product_shipping_reserve_policy` DROP COLUMN `startAt`'
    );
    await queryRunner.query(
      'ALTER TABLE `product_shipping_reserve_policy` DROP COLUMN `endAt`'
    );
    await queryRunner.query(
      'ALTER TABLE `product_shipping_reserve_policy` ADD `stock` smallint UNSIGNED NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `product_shipping_reserve_policy` DROP COLUMN `stock`'
    );
    await queryRunner.query(
      'ALTER TABLE `product_shipping_reserve_policy` ADD `endAt` datetime NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `product_shipping_reserve_policy` ADD `startAt` datetime NOT NULL'
    );
  }
}
