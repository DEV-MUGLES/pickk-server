import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRefactoring1614062991204 implements MigrationInterface {
  name = 'UserRefactoring1614062991204';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `name` `name` varchar(255) NULL DEFAULT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `weight` `weight` smallint NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `height` `height` smallint NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `height` `height` smallint NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `weight` `weight` smallint NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `name` `name` varchar(255) NULL'
    );
  }
}
