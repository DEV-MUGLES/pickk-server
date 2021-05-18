import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemNotice1621240687297 implements MigrationInterface {
  name = 'AddItemNotice1621240687297';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `item_notice` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `type` enum ('0', '1', '2', '3', '4') NOT NULL DEFAULT '4', `message` varchar(255) NOT NULL, `startAt` datetime NULL, `endAt` datetime NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query('ALTER TABLE `item` ADD `noticeId` int NULL');
    await queryRunner.query(
      'ALTER TABLE `item` ADD UNIQUE INDEX `IDX_3c0ed433ffc83afe3ebf667b15` (`noticeId`)'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_3c0ed433ffc83afe3ebf667b15` ON `item` (`noticeId`)'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_3c0ed433ffc83afe3ebf667b155` FOREIGN KEY (`noticeId`) REFERENCES `item_notice`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_3c0ed433ffc83afe3ebf667b155`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_3c0ed433ffc83afe3ebf667b15` ON `item`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP INDEX `IDX_3c0ed433ffc83afe3ebf667b15`'
    );
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `noticeId`');
    await queryRunner.query('DROP TABLE `item_notice`');
  }
}
