import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVbankReadyToOrderItemPayment1627380072942
  implements MigrationInterface
{
  name = 'AddVbankReadyToOrderItemPayment1627380072942';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `vbankReadyAt` datetime NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `payment` ADD `vbankReadyAt` timestamp NULL'
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` CHANGE `status` `status` enum ('pending', 'failed', 'vbank_ready', 'paid', 'withdrawn', 'ship_pending', 'ship_ready', 'shipping', 'shipped') NOT NULL"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "UPDATE `order_item` SET status = 'pending' WHERE status = 'vbank_ready'"
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` CHANGE `status` `status` enum ('pending', 'failed', 'paid', 'withdrawn', 'ship_pending', 'ship_ready', 'shipping', 'shipped') NOT NULL"
    );
    await queryRunner.query('ALTER TABLE `payment` DROP COLUMN `vbankReadyAt`');
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `vbankReadyAt`'
    );
  }
}
