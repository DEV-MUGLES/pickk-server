import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDigestAverageRating2Item1629803678125
  implements MigrationInterface
{
  name = 'AddDigestAverageRating2Item1629803678125';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `item` ADD `digestAverageRating` float NOT NULL DEFAULT '0'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item` DROP COLUMN `digestAverageRating`'
    );
  }
}
