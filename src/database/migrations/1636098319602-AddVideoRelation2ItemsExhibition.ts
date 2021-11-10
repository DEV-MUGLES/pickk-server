import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVideoRelation2ItemsExhibition1636098319602
  implements MigrationInterface
{
  name = 'AddVideoRelation2ItemsExhibition1636098319602';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `items_exhibition` ADD `videoId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `items_exhibition` ADD CONSTRAINT `FK_1dcf3dd8b6f3e4487baeae7072f` FOREIGN KEY (`videoId`) REFERENCES `video`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `items_exhibition` DROP FOREIGN KEY `FK_1dcf3dd8b6f3e4487baeae7072f`'
    );
    await queryRunner.query(
      'ALTER TABLE `items_exhibition` DROP COLUMN `videoId`'
    );
  }
}
