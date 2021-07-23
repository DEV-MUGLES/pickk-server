import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderOrderItem1627018022045 implements MigrationInterface {
  name = 'AddOrderOrderItem1627018022045';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `order_item` (`merchantUid` char(22) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `sellerId` int NULL, `itemId` int NULL, `productId` int NULL, `orderMerchantUid` char(20) NOT NULL, `status` enum ('pending', 'failed', 'paid', 'withdrawn', 'ship_pending', 'ship_ready', 'shipping', 'shipped') NOT NULL, `claimStatus` enum ('cancel_requested', 'cancelled', 'exchange_requested', 'exchanged', 'refund_requested', 'refunded') NULL, `quantity` smallint UNSIGNED NOT NULL, `isConfirmed` tinyint NOT NULL DEFAULT 0, `isSettled` tinyint NOT NULL DEFAULT 0, `itemFinalPrice` int UNSIGNED NOT NULL, `couponDiscountAmount` int UNSIGNED NOT NULL DEFAULT '0', `usedPointAmount` int UNSIGNED NOT NULL DEFAULT '0', `brandNameKor` varchar(30) NOT NULL, `itemName` varchar(255) NOT NULL, `productVariantName` varchar(255) NOT NULL, `recommenderId` int NULL, `recommenderNickname` varchar(11) NULL, `recommendContentType` enum ('Pickk', 'Look') NULL, `recommendContentItemId` int NULL, `courierId` int NULL, `trackCode` varchar(30) NULL, `failedAt` datetime NULL, `paidAt` datetime NULL, `withdrawnAt` datetime NULL, `shipReadyAt` datetime NULL, `shippingAt` datetime NULL, `shippedAt` datetime NULL, `cancelRequestedAt` datetime NULL, `cancelledAt` datetime NULL, `exchangeRequestedAt` datetime NULL, `exchangedAt` datetime NULL, `refundRequestedAt` datetime NULL, `refundedAt` datetime NULL, `shipReservedAt` datetime NULL, `confirmedAt` datetime NULL, `settledAt` datetime NULL, PRIMARY KEY (`merchantUid`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `order_buyer` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(15) NOT NULL, `email` varchar(255) NOT NULL, `phoneNumber` char(11) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `order_receiver` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `baseAddress` varchar(255) NOT NULL, `detailAddress` varchar(255) NOT NULL, `postalCode` varchar(255) NOT NULL, `name` varchar(15) NOT NULL, `email` varchar(255) NOT NULL, `phoneNumber` char(11) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `order_vbank_receipt` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `bankCode` enum ('02', '03', '04', '05', '06', '07', '11', '12', '16', '20', '21', '22', '23', '24', '25', '26', '27', '31', '32', '34', '35', '37', '38', '39', '41', '48', '50', '53', '54', '55', '56', '57', '59', '60', '64', '70', '71', '81', '83', '87', '88', '89', '90', '91', '93', '94', '96', '97', '98') NOT NULL, `number` varchar(14) NOT NULL, `ownerName` varchar(255) NOT NULL, `due` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `order` (`merchantUid` char(20) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `status` enum ('pending', 'paying', 'failed', 'vbank_ready', 'paid', 'withdrawn') NOT NULL, `payMethod` enum ('pending', 'paying', 'failed', 'vbank_ready', 'paid', 'withdrawn') NULL, `totalItemFinalPrice` int UNSIGNED NOT NULL, `totalShippingFee` int UNSIGNED NOT NULL, `totalCouponDiscountAmount` int UNSIGNED NOT NULL DEFAULT '0', `totalUsedPointAmount` int UNSIGNED NOT NULL DEFAULT '0', `totalPayAmount` int UNSIGNED NOT NULL DEFAULT '0', `payingAt` datetime NULL, `failedAt` datetime NULL, `vbankReadyAt` datetime NULL, `paidAt` datetime NULL, `withdrawnAt` datetime NULL, `vbankInfoId` int NULL, `buyerId` int NULL, `receiverId` int NULL, INDEX `idx_merchantUid` (`merchantUid`), UNIQUE INDEX `REL_dd872794500469f141a2bc7438` (`vbankInfoId`), UNIQUE INDEX `REL_20981b2b68bf03393c44dd1b9d` (`buyerId`), UNIQUE INDEX `REL_0ba887a07aa531f6c5821950ec` (`receiverId`), PRIMARY KEY (`merchantUid`)) ENGINE=InnoDB"
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
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_cfa63773c75aa44395ebcd491ff` FOREIGN KEY (`orderMerchantUid`) REFERENCES `order`(`merchantUid`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_42d59a472a186142e499b22fac6` FOREIGN KEY (`courierId`) REFERENCES `courier`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order` ADD CONSTRAINT `FK_caabe91507b3379c7ba73637b84` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order` ADD CONSTRAINT `FK_dd872794500469f141a2bc7438e` FOREIGN KEY (`vbankInfoId`) REFERENCES `order_vbank_receipt`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order` ADD CONSTRAINT `FK_20981b2b68bf03393c44dd1b9d7` FOREIGN KEY (`buyerId`) REFERENCES `order_buyer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order` ADD CONSTRAINT `FK_0ba887a07aa531f6c5821950ec0` FOREIGN KEY (`receiverId`) REFERENCES `order_receiver`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `order` DROP FOREIGN KEY `FK_0ba887a07aa531f6c5821950ec0`'
    );
    await queryRunner.query(
      'ALTER TABLE `order` DROP FOREIGN KEY `FK_20981b2b68bf03393c44dd1b9d7`'
    );
    await queryRunner.query(
      'ALTER TABLE `order` DROP FOREIGN KEY `FK_dd872794500469f141a2bc7438e`'
    );
    await queryRunner.query(
      'ALTER TABLE `order` DROP FOREIGN KEY `FK_caabe91507b3379c7ba73637b84`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_42d59a472a186142e499b22fac6`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_cfa63773c75aa44395ebcd491ff`'
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

    await queryRunner.query(
      'DROP INDEX `REL_0ba887a07aa531f6c5821950ec` ON `order`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_20981b2b68bf03393c44dd1b9d` ON `order`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_dd872794500469f141a2bc7438` ON `order`'
    );
    await queryRunner.query('DROP INDEX `idx_merchantUid` ON `order`');
    await queryRunner.query('DROP TABLE `order`');
    await queryRunner.query('DROP TABLE `order_vbank_receipt`');
    await queryRunner.query('DROP TABLE `order_receiver`');
    await queryRunner.query('DROP TABLE `order_buyer`');
    await queryRunner.query('DROP TABLE `order_item`');
  }
}
