import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserPhoneNumber1627470570777 implements MigrationInterface {
  name = 'AddUserPhoneNumber1627470570777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` ADD `phoneNumber` char(11) NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `phoneNumber`');
  }
}
