import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorShippingAddressIndex1616404140051
  implements MigrationInterface {
  name = 'RefactorShippingAddressIndex1616404140051';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
  }
}
