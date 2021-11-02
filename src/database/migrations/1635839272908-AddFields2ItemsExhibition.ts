import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFields2ItemsExhibition1635839272908
  implements MigrationInterface
{
  name = 'AddFields2ItemsExhibition1635839272908';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `items_exhibition` ADD `description` varchar(50) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `items_exhibition` ADD `imageUrl` varchar(255) NULL'
    );
    await queryRunner.query(
      "ALTER TABLE `items_exhibition` ADD `imageTop` smallint NOT NULL DEFAULT '0'"
    );
    await queryRunner.query(
      "ALTER TABLE `items_exhibition` ADD `imageRight` smallint NOT NULL DEFAULT '0'"
    );
    await queryRunner.query(
      'ALTER TABLE `items_exhibition` ADD `backgroundColor` varchar(12) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `items_exhibition` ADD `isVisible` tinyint NOT NULL DEFAULT 1'
    );
    await queryRunner.query(
      "ALTER TABLE `items_exhibition` ADD `order` smallint NOT NULL DEFAULT '0'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `items_exhibition` DROP COLUMN `order`'
    );
    await queryRunner.query(
      'ALTER TABLE `items_exhibition` DROP COLUMN `isVisible`'
    );
    await queryRunner.query(
      'ALTER TABLE `items_exhibition` DROP COLUMN `backgroundColor`'
    );
    await queryRunner.query(
      'ALTER TABLE `items_exhibition` DROP COLUMN `imageRight`'
    );
    await queryRunner.query(
      'ALTER TABLE `items_exhibition` DROP COLUMN `imageTop`'
    );
    await queryRunner.query(
      'ALTER TABLE `items_exhibition` DROP COLUMN `imageUrl`'
    );
    await queryRunner.query(
      'ALTER TABLE `items_exhibition` DROP COLUMN `description`'
    );
  }
}
