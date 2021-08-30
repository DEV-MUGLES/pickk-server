import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPriceVariant2ItemOptionValueAndProduct1630305174275
  implements MigrationInterface
{
  name = 'AddPriceVariant2ItemOptionValueAndProduct1630305174275';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_option_value` ADD `priceVariant` mediumint UNSIGNED NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `product` ADD `priceVariant` mediumint UNSIGNED NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `product` DROP COLUMN `priceVariant`');
    await queryRunner.query(
      'ALTER TABLE `item_option_value` DROP COLUMN `priceVariant`'
    );
  }
}
