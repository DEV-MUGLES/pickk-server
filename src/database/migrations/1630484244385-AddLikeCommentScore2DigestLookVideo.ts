import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLikeCommentScore2DigestLookVideo1630484244385
  implements MigrationInterface
{
  name = 'AddLikeCommentScore2DigestLookVideo1630484244385';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `digest` ADD `likeCommentOrderScore` float NOT NULL DEFAULT '0'"
    );
    await queryRunner.query(
      "ALTER TABLE `look` ADD `likeCommentScore` float NOT NULL DEFAULT '0'"
    );
    await queryRunner.query(
      "ALTER TABLE `video` ADD `likeCommentScore` float NOT NULL DEFAULT '0'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `video` DROP COLUMN `likeCommentScore`'
    );
    await queryRunner.query(
      'ALTER TABLE `look` DROP COLUMN `likeCommentScore`'
    );
    await queryRunner.query(
      'ALTER TABLE `digest` DROP COLUMN `likeCommentOrderScore`'
    );
  }
}
