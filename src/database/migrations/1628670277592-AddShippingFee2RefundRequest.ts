import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddShippingFee2RefundRequest1628670277592
  implements MigrationInterface
{
  name = 'AddShippingFee2RefundRequest1628670277592';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD `shippingFee` mediumint UNSIGNED NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP COLUMN `shippingFee`'
    );
  }
}
