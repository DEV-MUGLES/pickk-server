import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemProfile1617244733104 implements MigrationInterface {
  name = 'AddItemProfile1617244733104';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `item_thumbnail_image` (`key` varchar(75) NOT NULL, `angle` int NOT NULL DEFAULT '0', `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`key`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `item_profile` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `originalPrice` int NOT NULL, `salePrice` int NOT NULL, `isAvailable` tinyint NOT NULL DEFAULT 1, `brandId` int NOT NULL, `thumbnailImageKey` varchar(75) NULL, INDEX `IDX_554f171f16da2a3ff7cce9e708` (`salePrice`), UNIQUE INDEX `REL_3800b579cd41f009203199a4eb` (`thumbnailImageKey`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `item_profile_url` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `url` varchar(255) NOT NULL, `isPrimary` tinyint NOT NULL DEFAULT 0, `isAvailable` tinyint NOT NULL DEFAULT 1, `itemProfileId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `item_profile` ADD CONSTRAINT `FK_3800b579cd41f009203199a4eb7` FOREIGN KEY (`thumbnailImageKey`) REFERENCES `item_thumbnail_image`(`key`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item_profile` ADD CONSTRAINT `FK_7173901b6e0da84b15b138efccd` FOREIGN KEY (`brandId`) REFERENCES `brand`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item_profile_url` ADD CONSTRAINT `FK_c96107fb6be24230e3c5709216e` FOREIGN KEY (`itemProfileId`) REFERENCES `item_profile`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_profile_url` DROP FOREIGN KEY `FK_c96107fb6be24230e3c5709216e`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_profile` DROP FOREIGN KEY `FK_7173901b6e0da84b15b138efccd`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_profile` DROP FOREIGN KEY `FK_3800b579cd41f009203199a4eb7`'
    );
    await queryRunner.query('DROP TABLE `item_profile_url`');
    await queryRunner.query(
      'DROP INDEX `REL_3800b579cd41f009203199a4eb` ON `item_profile`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_554f171f16da2a3ff7cce9e708` ON `item_profile`'
    );
    await queryRunner.query('DROP TABLE `item_profile`');
    await queryRunner.query('DROP TABLE `item_thumbnail_image`');
  }
}
