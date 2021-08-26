import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsContentUpdated2Comment1630000378994
  implements MigrationInterface
{
  name = 'AddIsContentUpdated2Comment1630000378994';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `comment` ADD `isContentUpdated` tinyint NOT NULL DEFAULT 0'
    );
    await queryRunner.query(
      'ALTER TABLE `comment` ADD `contentUpdatedAt` datetime NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `comment` DROP COLUMN `contentUpdatedAt`'
    );
    await queryRunner.query(
      'ALTER TABLE `comment` DROP COLUMN `isContentUpdated`'
    );
  }
}
