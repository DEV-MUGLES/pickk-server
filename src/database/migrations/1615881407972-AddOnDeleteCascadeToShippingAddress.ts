import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOnDeleteCascadeToShippingAddress1615881407972
  implements MigrationInterface {
  name = 'AddOnDeleteCascadeToShippingAddress1615881407972';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `shipping_address` DROP FOREIGN KEY `FK_2aa99b101de6fb5f3089bd4b7a9`'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `code` `code` varchar(255) NULL DEFAULT NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_0802d2d7fb0bdbd7dedbb5c8ce` ON `shipping_address` (`userId`, `name`)'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` ADD CONSTRAINT `FK_2aa99b101de6fb5f3089bd4b7a9` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `shipping_address` DROP FOREIGN KEY `FK_2aa99b101de6fb5f3089bd4b7a9`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_0802d2d7fb0bdbd7dedbb5c8ce` ON `shipping_address`'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `code` `code` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` ADD CONSTRAINT `FK_2aa99b101de6fb5f3089bd4b7a9` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }
}
