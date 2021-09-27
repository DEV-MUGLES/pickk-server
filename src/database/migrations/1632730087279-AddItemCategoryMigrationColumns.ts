import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemCategoryMigrationColumns1632730087279
  implements MigrationInterface
{
  name = 'AddItemCategoryMigrationColumns1632730087279';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_category` ADD `oldItemMajorTypeId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` ADD `oldItemMinorTypeId` int NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_category` DROP COLUMN `oldItemMinorTypeId`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` DROP COLUMN `oldItemMajorTypeId`'
    );
  }
}
