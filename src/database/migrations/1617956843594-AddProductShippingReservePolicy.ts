import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductShippingReservePolicy1617956843594
  implements MigrationInterface
{
  name = 'AddProductShippingReservePolicy1617956843594';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item` CHANGE `displayPrice` `displayPrice` int NULL'
    );

    await queryRunner.query(
      'CREATE TABLE `product_shipping_reserve_policy` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `estimatedShippingBegginDate` datetime NOT NULL, `startAt` datetime NOT NULL, `endAt` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `product` ADD `shippingReservePolicyId` int NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_e65d1104583c629a62d4ab81ec` ON `product` (`shippingReservePolicyId`)'
    );
    await queryRunner.query(
      'ALTER TABLE `product` ADD CONSTRAINT `FK_e65d1104583c629a62d4ab81ec8` FOREIGN KEY (`shippingReservePolicyId`) REFERENCES `product_shipping_reserve_policy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `product` DROP FOREIGN KEY `FK_e65d1104583c629a62d4ab81ec8`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_e65d1104583c629a62d4ab81ec` ON `product`'
    );
    await queryRunner.query(
      'ALTER TABLE `product` DROP COLUMN `shippingReservePolicyId`'
    );
    await queryRunner.query('DROP TABLE `product_shipping_reserve_policy`');

    await queryRunner.query(
      'ALTER TABLE `item` CHANGE `displayPrice` `displayPrice` int NOT NULL'
    );
  }
}
