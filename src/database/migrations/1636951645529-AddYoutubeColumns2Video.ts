import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddYoutubeColumns2Video1636951645529
  implements MigrationInterface
{
  name = 'AddYoutubeColumns2Video1636951645529';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE video ADD `youtubeDuration` mediumint UNSIGNED NULL'
    );
    await queryRunner.query(
      'ALTER TABLE video ADD `youtubeViewCount` int UNSIGNED NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE video DROP COLUMN `youtubeViewCount`');
    await queryRunner.query('ALTER TABLE video DROP COLUMN `youtubeDuration`');
  }
}
