import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCommentContent2Nullable1629876210391
  implements MigrationInterface
{
  name = 'UpdateCommentContent2Nullable1629876210391';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `comment` CHANGE `content` `content` varchar(255) NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `comment` CHANGE `content` `content` varchar(255) NOT NULL'
    );
  }
}
