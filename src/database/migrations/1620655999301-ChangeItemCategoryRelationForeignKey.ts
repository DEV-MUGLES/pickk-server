import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeItemCategoryRelationForeignKey1620655999301
  implements MigrationInterface {
  name = 'ChangeItemCategoryRelationForeignKey1620655999301';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_3d02cb65b72a5edec012a9cdf69`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_9909642b5864c20bc5214211446`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` DROP COLUMN `createdAt`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` DROP COLUMN `updatedAt`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP COLUMN `majorCategoryCode`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP COLUMN `minorCategoryCode`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` ADD `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` ADD `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD `majorCategoryId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD `minorCategoryId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_997e492bfce50fe9ab960f5f5e3` FOREIGN KEY (`majorCategoryId`) REFERENCES `item_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_72ffb04a22a24bfed2824ba9e4e` FOREIGN KEY (`minorCategoryId`) REFERENCES `item_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_72ffb04a22a24bfed2824ba9e4e`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_997e492bfce50fe9ab960f5f5e3`'
    );
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `minorCategoryId`');
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `majorCategoryId`');
    await queryRunner.query(
      'ALTER TABLE `item_category` DROP COLUMN `updated_at`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` DROP COLUMN `created_at`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD `minorCategoryCode` varchar(20) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD `majorCategoryCode` varchar(20) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` ADD `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_9909642b5864c20bc5214211446` FOREIGN KEY (`majorCategoryCode`) REFERENCES `item_category`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_3d02cb65b72a5edec012a9cdf69` FOREIGN KEY (`minorCategoryCode`) REFERENCES `item_category`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }
}
