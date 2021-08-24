import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddScoreIndex2Keyword1629835803521 implements MigrationInterface {
  name = 'AddScoreIndex2Keyword1629835803521';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE INDEX `idx_score` ON `keyword` (`score`)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `idx_score` ON `keyword`');
  }
}
