import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSettle2ClaimRequests1631787323346
  implements MigrationInterface
{
  name = 'AddSettle2ClaimRequests1631787323346';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD `isSettled` tinyint NOT NULL DEFAULT 0'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD `settledAt` datetime NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD `isSettled` tinyint NOT NULL DEFAULT 0'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD `settledAt` datetime NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP COLUMN `settledAt`'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP COLUMN `isSettled`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP COLUMN `settledAt`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP COLUMN `isSettled`'
    );
  }
}
