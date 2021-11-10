import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductPriceVariant2OrderItem1635994356816
  implements MigrationInterface
{
  name = 'AddProductPriceVariant2OrderItem1635994356816';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `order_item` ADD `productPriceVariant` int UNSIGNED NOT NULL DEFAULT '0'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `productPriceVariant`'
    );
  }
}
