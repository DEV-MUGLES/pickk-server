import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemProfile1617240887649 implements MigrationInterface {
  name = 'AddItemProfile1617240887649';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `item_thumbnail_image` (`key` varchar(75) NOT NULL, `angle` int NOT NULL DEFAULT '0', `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`key`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `item_profile` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `originalPrice` int NOT NULL, `salePrice` int NOT NULL, `isAvailable` tinyint NOT NULL, `brandId` int NOT NULL, INDEX `IDX_554f171f16da2a3ff7cce9e708` (`salePrice`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `item_profile` ADD CONSTRAINT `FK_7173901b6e0da84b15b138efccd` FOREIGN KEY (`brandId`) REFERENCES `brand`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_profile` DROP FOREIGN KEY `FK_7173901b6e0da84b15b138efccd`'
    );
    await queryRunner.query('DROP TABLE `item_profile`');
    await queryRunner.query('DROP TABLE `item_thumbnail_image`');
  }
}
