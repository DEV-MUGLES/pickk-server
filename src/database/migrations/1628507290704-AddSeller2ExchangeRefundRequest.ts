import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSeller2ExchangeRefundRequest1628507290704
  implements MigrationInterface
{
  name = 'AddSeller2ExchangeRefundRequest1628507290704';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD `sellerId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD `sellerId` int NULL'
    );

    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD CONSTRAINT `FK_3b4625c136bee67bb53b886a0ed` FOREIGN KEY (`sellerId`) REFERENCES `seller`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD CONSTRAINT `FK_84ee57a271f20859698e35bc252` FOREIGN KEY (`sellerId`) REFERENCES `seller`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP FOREIGN KEY `FK_84ee57a271f20859698e35bc252`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP FOREIGN KEY `FK_3b4625c136bee67bb53b886a0ed`'
    );

    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP COLUMN `sellerId`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP COLUMN `sellerId`'
    );
  }
}
