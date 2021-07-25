import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderItemUsedCoupon1627230041382 implements MigrationInterface {
  name = 'AddOrderItemUsedCoupon1627230041382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `usedCouponId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `isShipReserved` tinyint NOT NULL DEFAULT 0'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `usedCouponName` varchar(30) NULL'
    );

    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_f04c1be37cdd4dc8b5b8216002f` FOREIGN KEY (`usedCouponId`) REFERENCES `coupon`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_f04c1be37cdd4dc8b5b8216002f`'
    );

    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `usedCouponName`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `isShipReserved`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `usedCouponId`'
    );
  }
}
