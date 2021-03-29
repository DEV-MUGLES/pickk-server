import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddShippingAddress1615822656845 implements MigrationInterface {
  name = 'AddShippingAddress1615822656845';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `shipping_address` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `receiverName` varchar(255) NOT NULL, `baseAddress` varchar(255) NOT NULL, `detailAddress` varchar(255) NOT NULL, `postalCode` varchar(255) NOT NULL, `phoneNumber1` char(11) NOT NULL, `phoneNumber2` char(11) NULL, `isPrimary` tinyint NOT NULL, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` ADD CONSTRAINT `FK_2aa99b101de6fb5f3089bd4b7a9` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `shipping_address` DROP FOREIGN KEY `FK_2aa99b101de6fb5f3089bd4b7a9`'
    );
    await queryRunner.query('DROP TABLE `shipping_address`');
  }
}
