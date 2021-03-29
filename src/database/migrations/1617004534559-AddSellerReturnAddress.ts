import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSellerReturnAddress1617004534559 implements MigrationInterface {
  name = 'AddSellerReturnAddress1617004534559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `seller_return_address` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `baseAddress` varchar(255) NOT NULL, `detailAddress` varchar(255) NOT NULL, `postalCode` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD `returnAddressId` int NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_d89bdeef7b538af93c258d0a8b` ON `seller` (`returnAddressId`)'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_d89bdeef7b538af93c258d0a8be` FOREIGN KEY (`returnAddressId`) REFERENCES `seller_return_address`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_d89bdeef7b538af93c258d0a8be`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_d89bdeef7b538af93c258d0a8b` ON `seller`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` DROP COLUMN `returnAddressId`'
    );
    await queryRunner.query('DROP TABLE `seller_return_address`');
  }
}
