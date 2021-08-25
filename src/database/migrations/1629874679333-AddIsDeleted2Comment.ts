import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsDeleted2Comment1629874679333 implements MigrationInterface {
  name = 'AddIsDeleted2Comment1629874679333';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `comment` ADD `isDeleted` tinyint NOT NULL DEFAULT 0'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `comment` DROP COLUMN `isDeleted`');
  }
}
