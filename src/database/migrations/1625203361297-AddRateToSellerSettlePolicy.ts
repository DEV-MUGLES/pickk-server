import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRateToSellerSettlePolicy1625203361297
  implements MigrationInterface {
  name = 'AddRateToSellerSettlePolicy1625203361297';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `seller_settle_policy` ADD `rate` tinyint UNSIGNED NOT NULL DEFAULT '70'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller_settle_policy` DROP COLUMN `rate`'
    );
  }
}
