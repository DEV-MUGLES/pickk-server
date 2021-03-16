import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserPassword1615315089172 implements MigrationInterface {
  name = 'AddUserPassword1615315089172';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `base_entity` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `password`');
    await queryRunner.query(
      'ALTER TABLE `user` ADD `passwordEncrypted` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `passwordSalt` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `passwordCreatedat` datetime NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `code` `code` varchar(255) NULL DEFAULT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `code` `code` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` DROP COLUMN `passwordCreatedat`'
    );
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `passwordSalt`');
    await queryRunner.query(
      'ALTER TABLE `user` DROP COLUMN `passwordEncrypted`'
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `password` varchar(255) NULL'
    );
    await queryRunner.query('DROP TABLE `base_entity`');
  }
}
