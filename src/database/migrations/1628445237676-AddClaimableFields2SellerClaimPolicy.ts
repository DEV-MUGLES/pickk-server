import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClaimableFields2SellerClaimPolicy1628445237676
  implements MigrationInterface
{
  name = 'AddClaimableFields2SellerClaimPolicy1628445237676';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller_claim_policy` ADD `isExchangable` tinyint NOT NULL DEFAULT 1'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_claim_policy` ADD `isRefundable` tinyint NOT NULL DEFAULT 1'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller_claim_policy` DROP COLUMN `isRefundable`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_claim_policy` DROP COLUMN `isExchangable`'
    );
  }
}
