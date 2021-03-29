import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserPassword1615315089172 implements MigrationInterface {
  name = 'AddUserPassword1615315089172';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` ADD `passwordEncrypted` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `passwordSalt` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `passwordCreatedat` datetime NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` DROP COLUMN `passwordCreatedat`'
    );
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `passwordSalt`');
    await queryRunner.query(
      'ALTER TABLE `user` DROP COLUMN `passwordEncrypted`'
    );
  }
}
