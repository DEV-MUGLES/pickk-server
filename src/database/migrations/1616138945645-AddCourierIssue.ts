import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCourierIssue1616138945645 implements MigrationInterface {
  name = 'AddCourierIssue1616138945645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `courier` ADD `issueEndat` timestamp NULL DEFAULT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `courier` ADD `issueMessage` varchar(255) NULL DEFAULT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `courier` DROP COLUMN `issueMessage`');
    await queryRunner.query('ALTER TABLE `courier` DROP COLUMN `issueEndat`');
  }
}
