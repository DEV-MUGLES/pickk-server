import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefundRequest1628183081418 implements MigrationInterface {
  name = 'AddRefundRequest1628183081418';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `refund_request` (`id` int NOT NULL AUTO_INCREMENT, `status` enum ('requested', 'picked', 'rejected', 'confirmed') NOT NULL, `orderMerchantUid` char(20) NOT NULL, `faultOf` enum ('customer', 'seller') NOT NULL, `reason` varchar(255) NOT NULL, `amount` int UNSIGNED NOT NULL DEFAULT '0', `rejectReason` varchar(255) NOT NULL, `requestedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `pickedAt` datetime NULL, `rejectedAt` datetime NULL, `confirmedAt` datetime NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );

    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `refundRequestId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_e779d5c936d2b3252a293d12828` FOREIGN KEY (`refundRequestId`) REFERENCES `refund_request`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );

    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD CONSTRAINT `FK_6d5ce5d85844cc91aa603e34356` FOREIGN KEY (`orderMerchantUid`) REFERENCES `order`(`merchantUid`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP FOREIGN KEY `FK_6d5ce5d85844cc91aa603e34356`'
    );

    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_e779d5c936d2b3252a293d12828`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `refundRequestId`'
    );

    await queryRunner.query('DROP TABLE `refund_request`');
  }
}
