import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRefactoring1614062339227 implements MigrationInterface {
  name = 'UserRefactoring1614062339227';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `email` `email` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`)'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `name` `name` varchar(255) NULL DEFAULT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `name` `name` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2`'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `email` `email` varchar(255) NOT NULL'
    );
  }
}
