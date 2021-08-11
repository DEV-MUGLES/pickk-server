import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExchangeRequest1628241103962 implements MigrationInterface {
  name = 'AddExchangeRequest1628241103962';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `exchange_request` (`id` int NOT NULL AUTO_INCREMENT, `userId` int NULL, `productId` int NULL, `orderItemMerchantUid` char(20) NOT NULL, `status` enum ('requested', 'picked', 'reshipping', 'reshipped', 'rejected') NOT NULL, `faultOf` enum ('customer', 'seller') NOT NULL, `reason` varchar(255) NOT NULL, `rejectReason` varchar(255) NULL, `shippingFee` mediumint UNSIGNED NOT NULL, `quantity` smallint UNSIGNED NOT NULL, `itemName` varchar(255) NOT NULL, `productVariantName` varchar(255) NOT NULL, `requestedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `pickedAt` datetime NULL, `reshippingAt` datetime NULL, `reshippedAt` datetime NULL, `rejectedAt` datetime NULL, `confirmedAt` datetime NULL, UNIQUE INDEX `REL_51588d4e1b3a94cb09e0363d92` (`orderItemMerchantUid`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );

    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD CONSTRAINT `FK_af4b3e36c73378c6905a030c596` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD CONSTRAINT `FK_37ac6cc40a16dcf3cfe71f6aa42` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD CONSTRAINT `FK_51588d4e1b3a94cb09e0363d92c` FOREIGN KEY (`orderItemMerchantUid`) REFERENCES `order_item`(`merchantUid`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP FOREIGN KEY `FK_51588d4e1b3a94cb09e0363d92c`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP FOREIGN KEY `FK_37ac6cc40a16dcf3cfe71f6aa42`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP FOREIGN KEY `FK_af4b3e36c73378c6905a030c596`'
    );

    await queryRunner.query(
      'DROP INDEX `REL_51588d4e1b3a94cb09e0363d92` ON `exchange_request`'
    );
    await queryRunner.query('DROP TABLE `exchange_request`');
  }
}
