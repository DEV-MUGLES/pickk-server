import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorUser1613984632039 implements MigrationInterface {
  name = 'RefactorUser1613984632039';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `createdAt`');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `updatedAt`');
    await queryRunner.query(
      'ALTER TABLE `user` ADD `email` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `password` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)'
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `name` `name` varchar(255) NULL DEFAULT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `name` `name` varchar(255) NOT NULL'
    );
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `updated_at`');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `created_at`');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `password`');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `email`');
    await queryRunner.query(
      'ALTER TABLE `user` ADD `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP'
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP'
    );
  }
}
