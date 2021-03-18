import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTypeForVarcharColumns1616083613273
  implements MigrationInterface {
  name = 'AddTypeForVarcharColumns1616083613273';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` MODIFY COLUMN `code` varchar(15) NULL DEFAULT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` MODIFY COLUMN `name` varchar(15) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` MODIFY COLUMN `phoneNumber1` char(11) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` MODIFY COLUMN `phoneNumber2` char(11) NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `shipping_address` MODIFY COLUMN `phoneNumber2` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` MODIFY COLUMN `phoneNumber1` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` MODIFY COLUMN `name` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` MODIFY COLUMN `code` varchar(255) NULL'
    );
  }
}
