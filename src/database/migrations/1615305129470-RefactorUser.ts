import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorUser1615305129470 implements MigrationInterface {
  name = 'RefactorUser1615305129470';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `code` `code` varchar(255) NULL DEFAULT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `password` `password` varchar(255) NULL DEFAULT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `password` `password` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `code` `code` varchar(255) NULL'
    );
  }
}
