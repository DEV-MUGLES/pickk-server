import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDelayColumns2OrderItemClaimRequests1628755960172
  implements MigrationInterface
{
  name = 'AddDelayColumns2OrderItemClaimRequests1628755960172';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `isDelaying` tinyint NOT NULL DEFAULT 0'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `isProcessDelaying` tinyint NOT NULL DEFAULT 0'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `delayedAt` datetime NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `delayedShipExpectedAt` datetime NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `processDelayedAt` datetime NULL'
    );

    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD `isProcessDelaying` tinyint NOT NULL DEFAULT 0'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD `processDelayedAt` datetime NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD `isProcessDelaying` tinyint NOT NULL DEFAULT 0'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD `processDelayedAt` datetime NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP COLUMN `processDelayedAt`'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP COLUMN `isProcessDelaying`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP COLUMN `processDelayedAt`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP COLUMN `isProcessDelaying`'
    );

    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `processDelayedAt`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `delayedShipExpectedAt`'
    );
    await queryRunner.query('ALTER TABLE `order_item` DROP COLUMN `delayedAt`');
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `isProcessDelaying`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `isDelaying`'
    );
  }
}
