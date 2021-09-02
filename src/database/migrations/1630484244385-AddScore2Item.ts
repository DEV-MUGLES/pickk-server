import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddScore2Item1630484244385 implements MigrationInterface {
  name = 'AddScore2Item1630484244385';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `item` ADD `score` float NOT NULL DEFAULT '0'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `score`');
  }
}
