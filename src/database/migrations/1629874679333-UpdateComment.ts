import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateComment1629874679333 implements MigrationInterface {
  name = 'UpdateComment1629874679333';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `comment` ADD `isDeleted` tinyint NOT NULL DEFAULT 0'
    );
    await queryRunner.query(
      'ALTER TABLE `comment` CHANGE `content` `content` varchar(255) NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `comment` CHANGE `content` `content` varchar(255) NOT NULL'
    );
    await queryRunner.query('ALTER TABLE `comment` DROP COLUMN `isDeleted`');
  }
}
