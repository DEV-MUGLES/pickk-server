import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderEntity1626782743402 implements MigrationInterface {
  name = 'AddOrderEntity1626782743402';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
      "CREATE TABLE `order` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `merchantUid` varchar(255) NOT NULL, `status` enum ('vbank_ready', 'paid', 'withdrawn') NOT NULL, `payMethod` enum ('vbank_ready', 'paid', 'withdrawn') NOT NULL, `totalItemFinalPrice` int UNSIGNED NOT NULL, `totalShippingFee` int UNSIGNED NOT NULL, `totalCouponDiscountAmount` int UNSIGNED NOT NULL, `totalUsedPointAmount` int UNSIGNED NOT NULL, `totalPayAmount` int UNSIGNED NOT NULL, `paidAt` datetime NULL, `withdrawnAt` datetime NULL, `vbankInfoId` int NULL, `buyerId` int NULL, `receiverId` int NULL, UNIQUE INDEX `REL_dd872794500469f141a2bc7438` (`vbankInfoId`), UNIQUE INDEX `REL_20981b2b68bf03393c44dd1b9d` (`buyerId`), UNIQUE INDEX `REL_0ba887a07aa531f6c5821950ec` (`receiverId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `orderId` int NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_646bf9ece6f45dbe41c203e06e0` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
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
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_646bf9ece6f45dbe41c203e06e0`'
    );
    await queryRunner.query('ALTER TABLE `order_item` DROP COLUMN `orderId`');
    await queryRunner.query(
      'DROP INDEX `REL_0ba887a07aa531f6c5821950ec` ON `order`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_20981b2b68bf03393c44dd1b9d` ON `order`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_dd872794500469f141a2bc7438` ON `order`'
    );
    await queryRunner.query('DROP TABLE `order`');
    await queryRunner.query('DROP TABLE `order_vbank_receipt`');
    await queryRunner.query('DROP TABLE `order_receiver`');
    await queryRunner.query('DROP TABLE `order_buyer`');
  }
}
