import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderItemEntity1626703585497 implements MigrationInterface {
  name = 'AddOrderItemEntity1626703585497';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `order_item` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `sellerId` int NULL, `itemId` int NULL, `productId` int NULL, `status` enum ('vbank_ready', 'paid', 'withdrawn', 'ship_pending', 'ship_ready', 'shipping', 'shipped') NOT NULL, `claimStatus` enum ('cancel_requested', 'cancelled', 'exchange_requested', 'exchanged', 'refund_requested', 'refunded') NULL, `quantity` smallint UNSIGNED NOT NULL, `isConfirmed` tinyint NOT NULL DEFAULT 0, `isSettled` tinyint NOT NULL DEFAULT 0, `itemFinalPrice` int UNSIGNED NOT NULL, `couponDiscountAmount` int UNSIGNED NOT NULL, `usedPointAmount` int UNSIGNED NOT NULL, `payAmount` int UNSIGNED NOT NULL, `brandNameKor` varchar(30) NOT NULL, `itemName` varchar(255) NOT NULL, `productVariantName` varchar(255) NOT NULL, `recommenderId` int NULL, `recommenderNickname` varchar(11) NULL, `referrerId` int NULL, `courierId` int NULL, `trackCode` varchar(30) NULL, `paidAt` datetime NULL, `withdrawnAt` datetime NULL, `shipReadyAt` datetime NULL, `shippingAt` datetime NULL, `shippedAt` datetime NULL, `cancelRequestedAt` datetime NULL, `cancelledAt` datetime NULL, `exchangeRequestedAt` datetime NULL, `exchangedAt` datetime NULL, `refundRequestedAt` datetime NULL, `refundedAt` datetime NULL, `shipReservedAt` datetime NULL, `confirmedAt` datetime NULL, `settledAt` datetime NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_845716d96530a440c6cdc6c7346` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_accbcd2a4efb9b9354fa0acdd44` FOREIGN KEY (`sellerId`) REFERENCES `seller`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_e03f3ed4dab80a3bf3eca50babc` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_904370c093ceea4369659a3c810` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_e4e60d40c2e0180da1623e44d5a` FOREIGN KEY (`referrerId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_42d59a472a186142e499b22fac6` FOREIGN KEY (`courierId`) REFERENCES `courier`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_42d59a472a186142e499b22fac6`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_e4e60d40c2e0180da1623e44d5a`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_904370c093ceea4369659a3c810`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_e03f3ed4dab80a3bf3eca50babc`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_accbcd2a4efb9b9354fa0acdd44`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_845716d96530a440c6cdc6c7346`'
    );
    await queryRunner.query('DROP TABLE `order_item`');
  }
}
