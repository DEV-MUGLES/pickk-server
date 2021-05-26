import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSellerFields1622045009031 implements MigrationInterface {
  name = 'AddSellerFields1622045009031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `seller_claim_policy` ADD `feePayMethod` enum ('trans', 'enclose') NOT NULL DEFAULT 'enclose'"
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD `orderNotiPhoneNumber` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD `csNotiPhoneNumber` varchar(255) NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller` DROP COLUMN `csNotiPhoneNumber`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` DROP COLUMN `orderNotiPhoneNumber`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_claim_policy` DROP COLUMN `feePayMethod`'
    );
  }
}
