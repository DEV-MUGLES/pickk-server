import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSellerClaimAccount1622129848529 implements MigrationInterface {
  name = 'AddSellerClaimAccount1622129848529';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `seller_claim_account` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `bankCode` enum ('02', '03', '04', '05', '06', '07', '11', '12', '16', '20', '21', '22', '23', '24', '25', '26', '27', '31', '32', '34', '35', '37', '38', '39', '41', '48', '50', '53', '54', '55', '56', '57', '59', '60', '64', '70', '71', '81', '83', '87', '88', '89', '90', '91', '93', '94', '96', '97', '98') NOT NULL, `number` varchar(14) NOT NULL, `ownerName` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'ALTER TABLE `seller_claim_policy` ADD `accountId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_claim_policy` ADD UNIQUE INDEX `IDX_0bb33677e9ab25a3d7ab2d38d4` (`accountId`)'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_0bb33677e9ab25a3d7ab2d38d4` ON `seller_claim_policy` (`accountId`)'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_claim_policy` ADD CONSTRAINT `FK_0bb33677e9ab25a3d7ab2d38d44` FOREIGN KEY (`accountId`) REFERENCES `seller_claim_account`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller_claim_policy` DROP FOREIGN KEY `FK_0bb33677e9ab25a3d7ab2d38d44`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_0bb33677e9ab25a3d7ab2d38d4` ON `seller_claim_policy`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_claim_policy` DROP INDEX `IDX_0bb33677e9ab25a3d7ab2d38d4`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_claim_policy` DROP COLUMN `accountId`'
    );
    await queryRunner.query('DROP TABLE `seller_claim_account`');
  }
}
