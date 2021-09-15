import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMerchantUid2RefundRequest1631725613082
  implements MigrationInterface
{
  name = 'AddMerchantUid2RefundRequest1631725613082';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_e779d5c936d2b3252a293d12828`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `refundRequestId`'
    );
    await queryRunner.query('DROP TABLE `refund_request`');

    await queryRunner.query(
      "CREATE TABLE `refund_request` (`merchantUid` char(20) NOT NULL, `sellerId` int NULL, `userId` int NULL, `shipmentId` int NULL, `orderMerchantUid` char(20) NOT NULL, `status` enum ('requested', 'picked', 'rejected', 'confirmed') NOT NULL, `faultOf` enum ('customer', 'seller') NOT NULL, `reason` varchar(255) NOT NULL, `amount` int UNSIGNED NOT NULL DEFAULT '0', `shippingFee` mediumint UNSIGNED NOT NULL, `rejectReason` varchar(255) NULL, `isProcessDelaying` tinyint NOT NULL DEFAULT 0, `processDelayedAt` datetime NULL, `requestedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `pickedAt` datetime NULL, `rejectedAt` datetime NULL, `confirmedAt` datetime NULL, UNIQUE INDEX `REL_9f823dc7c469bc50c123b06ad2` (`shipmentId`), PRIMARY KEY (`merchantUid`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `refundRequestMerchantUid` char(20) NULL'
    );

    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD CONSTRAINT `FK_84ee57a271f20859698e35bc252` FOREIGN KEY (`sellerId`) REFERENCES `seller`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD CONSTRAINT `FK_7c0a897722ae26cd0c25a1c4d00` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD CONSTRAINT `FK_9f823dc7c469bc50c123b06ad28` FOREIGN KEY (`shipmentId`) REFERENCES `shipment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD CONSTRAINT `FK_6d5ce5d85844cc91aa603e34356` FOREIGN KEY (`orderMerchantUid`) REFERENCES `order`(`merchantUid`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );

    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_8a4a675ef1d951ccee274ed5b36` FOREIGN KEY (`refundRequestMerchantUid`) REFERENCES `refund_request`(`merchantUid`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_8a4a675ef1d951ccee274ed5b36`'
    );

    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP FOREIGN KEY `FK_6d5ce5d85844cc91aa603e34356`'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP FOREIGN KEY `FK_9f823dc7c469bc50c123b06ad28`'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP FOREIGN KEY `FK_7c0a897722ae26cd0c25a1c4d00`'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP FOREIGN KEY `FK_84ee57a271f20859698e35bc252`'
    );

    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `refundRequestMerchantUid`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_9f823dc7c469bc50c123b06ad2` ON `refund_request`'
    );
    await queryRunner.query('DROP TABLE `refund_request`');
  }
}
