import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOnDeleteCascadeToShippingAddress1615881407972
  implements MigrationInterface {
  name = 'AddOnDeleteCascadeToShippingAddress1615881407972';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `code` `code` varchar(255) NULL DEFAULT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `code` `code` varchar(255) NULL'
    );
  }
}
