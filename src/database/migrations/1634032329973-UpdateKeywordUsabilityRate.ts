import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateKeywordUsabilityRate1634032329973
  implements MigrationInterface
{
  name = 'UpdateKeywordUsabilityRate1634032329973';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`keyword\` CHANGE \`usablityRate\` \`usablityRate\` float NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`keyword\` DROP COLUMN \`usablityRate\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`keyword\` ADD \`usablityRate\` tinyint UNSIGNED NULL`
    );
  }
}
