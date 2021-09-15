import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemsPackage1631728923055 implements MigrationInterface {
  name = 'AddItemsPackage1631728923055';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `items_package_item` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `packageId` int NULL, `itemId` int NULL, `order` smallint NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `items_package` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `code` varchar(50) NOT NULL, UNIQUE INDEX `IDX_a250f330fcfa3c053ded264bc9` (`code`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );

    await queryRunner.query(
      'ALTER TABLE `items_package_item` ADD CONSTRAINT `FK_c34d1ba9b8145d1a914b7fc5bf0` FOREIGN KEY (`packageId`) REFERENCES `items_package`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `items_package_item` ADD CONSTRAINT `FK_2b46125e748448c449bb4355385` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `items_package_item` DROP FOREIGN KEY `FK_2b46125e748448c449bb4355385`'
    );
    await queryRunner.query(
      'ALTER TABLE `items_package_item` DROP FOREIGN KEY `FK_c34d1ba9b8145d1a914b7fc5bf0`'
    );

    await queryRunner.query(
      'DROP INDEX `IDX_a250f330fcfa3c053ded264bc9` ON `items_package`'
    );
    await queryRunner.query('DROP TABLE `items_package`');
    await queryRunner.query('DROP TABLE `items_package_item`');
  }
}
