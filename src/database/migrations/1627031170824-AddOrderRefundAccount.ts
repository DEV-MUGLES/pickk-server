import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderRefundAccount1627031170824 implements MigrationInterface {
  name = 'AddOrderRefundAccount1627031170824';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `order_refund_account` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `bankCode` enum ('02', '03', '04', '05', '06', '07', '11', '12', '16', '20', '21', '22', '23', '24', '25', '26', '27', '31', '32', '34', '35', '37', '38', '39', '41', '48', '50', '53', '54', '55', '56', '57', '59', '60', '64', '70', '71', '81', '83', '87', '88', '89', '90', '91', '93', '94', '96', '97', '98') NOT NULL, `number` varchar(14) NOT NULL, `ownerName` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'ALTER TABLE `order` ADD `refundAccountId` int NULL'
    );

    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_7b8ec169516a3cd948e47f2116` ON `order` (`refundAccountId`)'
    );

    await queryRunner.query(
      'ALTER TABLE `order` ADD CONSTRAINT `FK_7b8ec169516a3cd948e47f2116f` FOREIGN KEY (`refundAccountId`) REFERENCES `order_refund_account`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `order` DROP FOREIGN KEY `FK_7b8ec169516a3cd948e47f2116f`'
    );

    await queryRunner.query(
      'DROP INDEX `REL_7b8ec169516a3cd948e47f2116` ON `order`'
    );

    await queryRunner.query(
      'ALTER TABLE `order` DROP COLUMN `refundAccountId`'
    );
    await queryRunner.query('DROP TABLE `order_refund_account`');
  }
}
