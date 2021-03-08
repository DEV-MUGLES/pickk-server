import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserCode1615210109051 implements MigrationInterface {
  name = 'AddUserCode1615210109051';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` ADD `code` varchar(255) NULL DEFAULT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD UNIQUE INDEX `IDX_c5f78ad8f82e492c25d07f047a` (`code`)'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `name` `name` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `password` `password` varchar(255) NULL DEFAULT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `password` `password` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `name` `name` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` DROP INDEX `IDX_c5f78ad8f82e492c25d07f047a`'
    );
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `code`');
  }
}
