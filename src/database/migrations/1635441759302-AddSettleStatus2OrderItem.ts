import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSettleStatus2OrderItem1635441759302
  implements MigrationInterface
{
  name = 'AddSettleStatus2OrderItem1635441759302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `order_item` ADD `settleStatus` enum ('Pending', 'Ready', 'Completed') NOT NULL DEFAULT 'Pending'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `settleStatus`'
    );
  }
}
