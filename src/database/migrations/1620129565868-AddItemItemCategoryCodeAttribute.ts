import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemItemCategoryCodeAttribute1620129565868
  implements MigrationInterface {
  name = 'AddItemItemCategoryCodeAttribute1620129565868';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item` ADD `majorCategoryCode` varchar(255)'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD `minorCategoryCode` varchar(255)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item` DROP COLUMN `minorCategoryCode`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP COLUMN `majorCategoryCode`'
    );
  }
}
