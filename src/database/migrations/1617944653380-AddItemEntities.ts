import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemEntities1617944653380 implements MigrationInterface {
  name = 'AddItemEntities1617944653380';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller` CHANGE `courierId` `courierId` int NOT NULL'
    );

    await queryRunner.query(
      "CREATE TABLE `item_thumbnail_image` (`key` varchar(75) NOT NULL, `angle` int NOT NULL DEFAULT '0', `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`key`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `item` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `description` varchar(100) NULL, `originalPrice` int NOT NULL, `salePrice` int NOT NULL, `displayPrice` int NOT NULL, `priceUnit` enum ('KRW', 'USD', 'JPY', 'CNY', 'EUR', 'GBP', 'AUD', 'CAD') NOT NULL DEFAULT 'KRW', `isAvailable` tinyint NOT NULL DEFAULT 1, `isSellable` tinyint NOT NULL DEFAULT 0, `isPurchasable` tinyint NOT NULL DEFAULT 0, `brandId` int NOT NULL, `thumbnailImageKey` varchar(75) NULL, INDEX `IDX_d7ee3c98b388714c02efc9fb82` (`salePrice`), UNIQUE INDEX `REL_a6a019c109e8cc340012b3f863` (`thumbnailImageKey`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `item_detail_image` (`key` varchar(75) NOT NULL, `angle` int NOT NULL DEFAULT '0', `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `itemId` int NULL, PRIMARY KEY (`key`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `item_option` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(20) NOT NULL, `order` tinyint UNSIGNED NOT NULL DEFAULT '0', `itemId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `item_option_value` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(20) NOT NULL, `order` tinyint UNSIGNED NOT NULL DEFAULT '0', `itemId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `item_url` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `url` varchar(255) NOT NULL, `isPrimary` tinyint NOT NULL DEFAULT 0, `isAvailable` tinyint NOT NULL DEFAULT 1, `itemId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_a6a019c109e8cc340012b3f863b` FOREIGN KEY (`thumbnailImageKey`) REFERENCES `item_thumbnail_image`(`key`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_9e2a16fa67338b5d7ba015b4e98` FOREIGN KEY (`brandId`) REFERENCES `brand`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item_detail_image` ADD CONSTRAINT `FK_56aa44843bb95f27172978212ee` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item_option` ADD CONSTRAINT `FK_29234bbba073cb0761b4c65b417` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item_option_value` ADD CONSTRAINT `FK_fd3b3c7bc62c184c8f2889caf77` FOREIGN KEY (`itemId`) REFERENCES `item_option`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item_url` ADD CONSTRAINT `FK_d6e09541765216738641861da02` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_url` DROP FOREIGN KEY `FK_d6e09541765216738641861da02`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_option_value` DROP FOREIGN KEY `FK_fd3b3c7bc62c184c8f2889caf77`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_option` DROP FOREIGN KEY `FK_29234bbba073cb0761b4c65b417`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_detail_image` DROP FOREIGN KEY `FK_56aa44843bb95f27172978212ee`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_9e2a16fa67338b5d7ba015b4e98`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_a6a019c109e8cc340012b3f863b`'
    );
    await queryRunner.query('DROP TABLE `item_url`');
    await queryRunner.query('DROP TABLE `item_option_value`');
    await queryRunner.query('DROP TABLE `item_option`');
    await queryRunner.query('DROP TABLE `item_detail_image`');
    await queryRunner.query(
      'DROP INDEX `REL_a6a019c109e8cc340012b3f863` ON `item`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_d7ee3c98b388714c02efc9fb82` ON `item`'
    );
    await queryRunner.query('DROP TABLE `item`');
    await queryRunner.query('DROP TABLE `item_thumbnail_image`');

    await queryRunner.query(
      'ALTER TABLE `seller` CHANGE `courierId` `courierId` int NULL'
    );
  }
}
