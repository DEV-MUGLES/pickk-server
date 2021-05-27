import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSellerSettlePolicy1622136434597 implements MigrationInterface {
  name = 'AddSellerSettlePolicy1622136434597';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `seller_settle_account` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `bankCode` enum ('02', '03', '04', '05', '06', '07', '11', '12', '16', '20', '21', '22', '23', '24', '25', '26', '27', '31', '32', '34', '35', '37', '38', '39', '41', '48', '50', '53', '54', '55', '56', '57', '59', '60', '64', '70', '71', '81', '83', '87', '88', '89', '90', '91', '93', '94', '96', '97', '98') NOT NULL, `number` varchar(14) NOT NULL, `ownerName` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `seller_settle_policy` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `phoneNumber` char(11) NOT NULL, `picName` varchar(20) NOT NULL, `email` varchar(255) NOT NULL, `accountId` int NULL, UNIQUE INDEX `REL_4e078897bff45af2692dd1a34c` (`accountId`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD `settlePolicyId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD UNIQUE INDEX `IDX_b0ef5d00859256477eeefb25d3` (`settlePolicyId`)'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_b0ef5d00859256477eeefb25d3` ON `seller` (`settlePolicyId`)'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_settle_policy` ADD CONSTRAINT `FK_4e078897bff45af2692dd1a34cd` FOREIGN KEY (`accountId`) REFERENCES `seller_claim_account`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_b0ef5d00859256477eeefb25d35` FOREIGN KEY (`settlePolicyId`) REFERENCES `seller_settle_policy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_b0ef5d00859256477eeefb25d35`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_settle_policy` DROP FOREIGN KEY `FK_4e078897bff45af2692dd1a34cd`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_b0ef5d00859256477eeefb25d3` ON `seller`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` DROP INDEX `IDX_b0ef5d00859256477eeefb25d3`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` DROP COLUMN `settlePolicyId`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_4e078897bff45af2692dd1a34c` ON `seller_settle_policy`'
    );
    await queryRunner.query('DROP TABLE `seller_settle_policy`');
    await queryRunner.query('DROP TABLE `seller_settle_account`');
  }
}
