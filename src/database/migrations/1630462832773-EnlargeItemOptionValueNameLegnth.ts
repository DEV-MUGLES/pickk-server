import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnlargeItemOptionValueNameLegnth1630462832773
  implements MigrationInterface
{
  name = 'EnlargeItemOptionValueNameLegnth1630462832773';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_option_value` DROP COLUMN `name`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_option_value` ADD `name` varchar(255) NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_option_value` DROP COLUMN `name`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_option_value` ADD `name` varchar(20) NOT NULL'
    );
  }
}
