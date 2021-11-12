import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddYoutubeColumns2Video1636684224794
  implements MigrationInterface {
  name = 'AddYoutubeColumns2Video1636684224794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE video ADD `youtubeDuration` mediumint UNSIGNED NOT NULL DEFAULT '0'"
    );
    await queryRunner.query(
      "ALTER TABLE video ADD `youtubeViewCount` mediumint UNSIGNED NOT NULL DEFAULT '0'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE video DROP COLUMN `youtubeViewCount`');
    await queryRunner.query('ALTER TABLE video DROP COLUMN `youtubeDuration`');
  }
}
