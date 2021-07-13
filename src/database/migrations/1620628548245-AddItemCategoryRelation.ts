import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemCategoryRelation1620628548245
  implements MigrationInterface
{
  name = 'AddItemCategoryRelation1620628548245';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_category` DROP COLUMN `created_at`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` DROP COLUMN `updated_at`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` ADD `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD `majorCategoryCode` varchar(20) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD `minorCategoryCode` varchar(20) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_9909642b5864c20bc5214211446` FOREIGN KEY (`majorCategoryCode`) REFERENCES `item_category`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_3d02cb65b72a5edec012a9cdf69` FOREIGN KEY (`minorCategoryCode`) REFERENCES `item_category`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_3d02cb65b72a5edec012a9cdf69`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_9909642b5864c20bc5214211446`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP COLUMN `minorCategoryCode`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP COLUMN `majorCategoryCode`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` DROP COLUMN `updatedAt`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` DROP COLUMN `createdAt`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` ADD `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` ADD `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)'
    );
  }
}
