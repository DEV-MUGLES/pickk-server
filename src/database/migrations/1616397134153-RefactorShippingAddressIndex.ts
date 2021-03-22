import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorShippingAddressIndex1616397134153
  implements MigrationInterface {
  name = 'RefactorShippingAddressIndex1616397134153';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_0802d2d7fb0bdbd7dedbb5c8ce` ON `shipping_address`'
    );
    await queryRunner.query(
      'ALTER TABLE `brand` CHANGE `nameEng` `nameEng` varchar(30) NULL DEFAULT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `brand` CHANGE `description` `description` varchar(255) NULL DEFAULT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `courier` CHANGE `issueMessage` `issueMessage` varchar(255) NULL DEFAULT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `courier` CHANGE `issueEndat` `issueEndat` timestamp NULL DEFAULT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `code` `code` varchar(15) NULL DEFAULT NULL'
    );
    await queryRunner.query(
      'CREATE INDEX `idx_userId` ON `shipping_address` (`userId`)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `idx_userId` ON `shipping_address`');
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `code` `code` varchar(15) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `courier` CHANGE `issueEndat` `issueEndat` timestamp NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `courier` CHANGE `issueMessage` `issueMessage` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `brand` CHANGE `description` `description` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `brand` CHANGE `nameEng` `nameEng` varchar(30) NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_0802d2d7fb0bdbd7dedbb5c8ce` ON `shipping_address` (`userId`, `name`)'
    );
  }
}
