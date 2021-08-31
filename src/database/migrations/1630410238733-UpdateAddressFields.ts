import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAddressFields1630410238733 implements MigrationInterface {
  name = 'UpdateAddressFields1630410238733';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `shipping_address` DROP COLUMN `phoneNumber1`'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` DROP COLUMN `phoneNumber2`'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` ADD `phoneNumber` char(11) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_return_address` ADD `name` varchar(30) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_return_address` ADD `receiverName` varchar(50) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_return_address` ADD `phoneNumber` char(11) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `order_receiver` ADD `receiverName` varchar(50) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` DROP COLUMN `name`'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` ADD `name` varchar(30) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` DROP COLUMN `receiverName`'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` ADD `receiverName` varchar(50) NOT NULL'
    );

    await queryRunner.query('ALTER TABLE `order_receiver` DROP COLUMN `name`');
    await queryRunner.query(
      'ALTER TABLE `order_receiver` ADD `name` varchar(30) NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `order_receiver` DROP COLUMN `name`');
    await queryRunner.query(
      'ALTER TABLE `order_receiver` ADD `name` varchar(15) NOT NULL'
    );

    await queryRunner.query(
      'ALTER TABLE `shipping_address` DROP COLUMN `receiverName`'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` ADD `receiverName` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` DROP COLUMN `name`'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` ADD `name` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `order_receiver` DROP COLUMN `receiverName`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_return_address` DROP COLUMN `phoneNumber`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_return_address` DROP COLUMN `receiverName`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_return_address` DROP COLUMN `name`'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` DROP COLUMN `phoneNumber`'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` ADD `phoneNumber2` char(11) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` ADD `phoneNumber1` char(11) NOT NULL'
    );
  }
}
