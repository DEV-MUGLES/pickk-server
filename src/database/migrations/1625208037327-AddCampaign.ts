import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCampaign1625208037327 implements MigrationInterface {
  name = 'AddCampaign1625208037327';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `campaign` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `rate` tinyint UNSIGNED NOT NULL, `startAt` datetime NOT NULL, `endAt` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `item_campaigns_campaign` (`itemId` int NOT NULL, `campaignId` int NOT NULL, INDEX `IDX_9f4e664a60b28c994f75ff1a52` (`itemId`), INDEX `IDX_dee536cf72aa709878bcceabb7` (`campaignId`), PRIMARY KEY (`itemId`, `campaignId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `item_campaigns_campaign` ADD CONSTRAINT `FK_9f4e664a60b28c994f75ff1a52d` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item_campaigns_campaign` ADD CONSTRAINT `FK_dee536cf72aa709878bcceabb70` FOREIGN KEY (`campaignId`) REFERENCES `campaign`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_campaigns_campaign` DROP FOREIGN KEY `FK_dee536cf72aa709878bcceabb70`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_campaigns_campaign` DROP FOREIGN KEY `FK_9f4e664a60b28c994f75ff1a52d`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_dee536cf72aa709878bcceabb7` ON `item_campaigns_campaign`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_9f4e664a60b28c994f75ff1a52` ON `item_campaigns_campaign`'
    );
    await queryRunner.query('DROP TABLE `item_campaigns_campaign`');
    await queryRunner.query('DROP TABLE `campaign`');
  }
}
