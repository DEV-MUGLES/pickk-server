import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddScoreAndIndices2Item1630649572505
  implements MigrationInterface
{
  name = 'AddScoreAndIndices2Item1630649572505';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_b4d06354b8b23c50033531a621` ON `item`'
    );

    await queryRunner.query(
      "ALTER TABLE `item` ADD `score` float NOT NULL DEFAULT '0'"
    );

    await queryRunner.query(
      'CREATE INDEX `idx_minorCategoryId-code` ON `item` (`minorCategoryId`, `score`)'
    );
    await queryRunner.query(
      'CREATE INDEX `idx_majorCategoryId-code` ON `item` (`majorCategoryId`, `score`)'
    );
    await queryRunner.query(
      'CREATE INDEX `idx_providedCode` ON `item` (`providedCode`)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `idx_providedCode` ON `item`');

    await getOrCreateIndice(queryRunner, [
      {
        keyName: 'FK_997e492bfce50fe9ab960f5f5e3',
        columnName: 'majorCategoryId',
      },
      {
        keyName: 'FK_72ffb04a22a24bfed2824ba9e4e',
        columnName: 'minorCategoryId',
      },
    ]);

    await queryRunner.query('DROP INDEX `idx_majorCategoryId-code` ON `item`');
    await queryRunner.query('DROP INDEX `idx_minorCategoryId-code` ON `item`');

    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `score`');

    await queryRunner.query(
      'CREATE INDEX `IDX_b4d06354b8b23c50033531a621` ON `item` (`providedCode`)'
    );
  }
}

const getOrCreateIndice = async (
  queryRunner: QueryRunner,
  input: { keyName: string; columnName: string }[]
) => {
  const indice = await queryRunner.query('SHOW INDEX FROM `item`');

  for (const { keyName, columnName } of input) {
    if (indice.findIndex((index) => index.Key_name === keyName) < 0) {
      await queryRunner.query(
        'CREATE INDEX `' + keyName + '` ON `item` (`' + columnName + '`)'
      );
    }
  }
};
