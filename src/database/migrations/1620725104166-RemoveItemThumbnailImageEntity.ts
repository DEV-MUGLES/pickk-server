import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveItemThumbnailImageEntity1620725104166
  implements MigrationInterface {
  name = 'RemoveItemThumbnailImageEntity1620725104166';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_a6a019c109e8cc340012b3f863b`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_a6a019c109e8cc340012b3f863` ON `item`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP COLUMN `thumbnailImageKey`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD `imageUrl` varchar(255) NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `imageUrl`');
    await queryRunner.query(
      'ALTER TABLE `item` ADD `thumbnailImageKey` varchar(75) NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_a6a019c109e8cc340012b3f863` ON `item` (`thumbnailImageKey`)'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_a6a019c109e8cc340012b3f863b` FOREIGN KEY (`thumbnailImageKey`) REFERENCES `item_thumbnail_image`(`key`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }
}
