import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorItem1621228679349 implements MigrationInterface {
  name = 'RefactorItem1621228679349';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `isManaging`');
    await queryRunner.query(
      'ALTER TABLE `item` ADD `isInfiniteStock` tinyint NOT NULL DEFAULT 1'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD `isSoldout` tinyint NOT NULL DEFAULT 0'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `isSoldout`');
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `isInfiniteStock`');
    await queryRunner.query(
      "ALTER TABLE `item` ADD `isManaging` tinyint NOT NULL DEFAULT '1'"
    );
  }
}
