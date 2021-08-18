import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDigestAndImage1629269986675 implements MigrationInterface {
  name = 'AddDigestAndImage1629269986675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `digest` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `itemId` int NULL, `userId` int NULL, `size` varchar(30) NOT NULL, `rating` mediumint NULL, `title` varchar(127) NULL, `content` varchar(2047) NULL, `timestampStartSecond` smallint UNSIGNED NULL, `timestampEndSecond` smallint UNSIGNED NULL, `likeCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `hitCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `commentCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `score` float NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `digest_image` (`key` varchar(75) NOT NULL, `angle` int NOT NULL DEFAULT '0', `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `digestId` int NULL, PRIMARY KEY (`key`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `digest_item_property_values_item_property_value` (`digestId` int NOT NULL, `itemPropertyValueId` int NOT NULL, INDEX `IDX_ba11b49f945cf8c77b8e4aca14` (`digestId`), INDEX `IDX_950ef07eadf73a33332e7fa144` (`itemPropertyValueId`), PRIMARY KEY (`digestId`, `itemPropertyValueId`)) ENGINE=InnoDB'
    );

    await queryRunner.query(
      'ALTER TABLE `digest` ADD CONSTRAINT `FK_1c1435c2b5e04100ba08672b10a` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `digest` ADD CONSTRAINT `FK_5a92196da371955acc43aaf5ec0` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `digest_image` ADD CONSTRAINT `FK_5d0fe9db75bd515214126177827` FOREIGN KEY (`digestId`) REFERENCES `digest`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );

    await queryRunner.query(
      'ALTER TABLE `digest_item_property_values_item_property_value` ADD CONSTRAINT `FK_ba11b49f945cf8c77b8e4aca145` FOREIGN KEY (`digestId`) REFERENCES `digest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `digest_item_property_values_item_property_value` ADD CONSTRAINT `FK_950ef07eadf73a33332e7fa144b` FOREIGN KEY (`itemPropertyValueId`) REFERENCES `item_property_value`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `digest_item_property_values_item_property_value` DROP FOREIGN KEY `FK_950ef07eadf73a33332e7fa144b`'
    );
    await queryRunner.query(
      'ALTER TABLE `digest_item_property_values_item_property_value` DROP FOREIGN KEY `FK_ba11b49f945cf8c77b8e4aca145`'
    );

    await queryRunner.query(
      'ALTER TABLE `digest_image` DROP FOREIGN KEY `FK_5d0fe9db75bd515214126177827`'
    );
    await queryRunner.query(
      'ALTER TABLE `digest` DROP FOREIGN KEY `FK_5a92196da371955acc43aaf5ec0`'
    );
    await queryRunner.query(
      'ALTER TABLE `digest` DROP FOREIGN KEY `FK_1c1435c2b5e04100ba08672b10a`'
    );

    await queryRunner.query(
      'DROP INDEX `IDX_950ef07eadf73a33332e7fa144` ON `digest_item_property_values_item_property_value`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_ba11b49f945cf8c77b8e4aca14` ON `digest_item_property_values_item_property_value`'
    );
    await queryRunner.query(
      'DROP TABLE `digest_item_property_values_item_property_value`'
    );
    await queryRunner.query('DROP TABLE `digest_image`');
    await queryRunner.query('DROP TABLE `digest`');
  }
}
