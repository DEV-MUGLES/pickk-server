import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSettleAmount2OrderItem1635437705108
  implements MigrationInterface
{
  name = 'AddSettleAmount2OrderItem1635437705108';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `settleAmount` int UNSIGNED NULL'
    );
    await queryRunner.query('UPDATE `order_item` SET `settleAmount` = 0;');
    await queryRunner.query(
      'ALTER TABLE `order_item` CHANGE `settleAmount` `settleAmount` int UNSIGNED NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `settleAmount`'
    );
  }
}
