import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItem1617874274811 implements MigrationInterface {
  name = 'AddItem1617874274811';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `item_thumbnail_image` (`key` varchar(75) NOT NULL, `angle` int NOT NULL DEFAULT '0', `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`key`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `item` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `originalPrice` int NOT NULL, `salePrice` int NOT NULL, `isAvailable` tinyint NOT NULL DEFAULT 1, `brandId` int NOT NULL, `thumbnailImageKey` varchar(75) NULL, INDEX `IDX_d7ee3c98b388714c02efc9fb82` (`salePrice`), UNIQUE INDEX `REL_a6a019c109e8cc340012b3f863` (`thumbnailImageKey`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `item_url` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `url` varchar(255) NOT NULL, `isPrimary` tinyint NOT NULL DEFAULT 0, `isAvailable` tinyint NOT NULL DEFAULT 1, `itemId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` CHANGE `courierId` `courierId` int NOT NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_c5f78ad8f82e492c25d07f047a` ON `user` (`code`)'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_a6a019c109e8cc340012b3f863b` FOREIGN KEY (`thumbnailImageKey`) REFERENCES `item_thumbnail_image`(`key`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_9e2a16fa67338b5d7ba015b4e98` FOREIGN KEY (`brandId`) REFERENCES `brand`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
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
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_9e2a16fa67338b5d7ba015b4e98`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_a6a019c109e8cc340012b3f863b`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_c5f78ad8f82e492c25d07f047a` ON `user`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` CHANGE `courierId` `courierId` int NULL'
    );
    await queryRunner.query('DROP TABLE `item_url`');
    await queryRunner.query(
      'DROP INDEX `REL_a6a019c109e8cc340012b3f863` ON `item`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_d7ee3c98b388714c02efc9fb82` ON `item`'
    );
    await queryRunner.query('DROP TABLE `item`');
    await queryRunner.query('DROP TABLE `item_thumbnail_image`');
  }
}
