import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefundAccount1625213254157 implements MigrationInterface {
  name = 'AddRefundAccount1625213254157';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `refund_account` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `bankCode` enum ('02', '03', '04', '05', '06', '07', '11', '12', '16', '20', '21', '22', '23', '24', '25', '26', '27', '31', '32', '34', '35', '37', '38', '39', '41', '48', '50', '53', '54', '55', '56', '57', '59', '60', '64', '70', '71', '81', '83', '87', '88', '89', '90', '91', '93', '94', '96', '97', '98') NOT NULL, `number` varchar(14) NOT NULL, `ownerName` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `refundAccountId` int NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_4859a7a25f8209f14be8403fbb` ON `user` (`refundAccountId`)'
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD CONSTRAINT `FK_4859a7a25f8209f14be8403fbbf` FOREIGN KEY (`refundAccountId`) REFERENCES `refund_account`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` DROP FOREIGN KEY `FK_4859a7a25f8209f14be8403fbbf`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_4859a7a25f8209f14be8403fbb` ON `user`'
    );
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `refundAccountId`');
    await queryRunner.query('DROP TABLE `refund_account`');
  }
}
