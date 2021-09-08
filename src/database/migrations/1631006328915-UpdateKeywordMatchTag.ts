import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateKeywordMatchTag1631006328915 implements MigrationInterface {
  name = 'UpdateKeywordMatchTag1631006328915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `keyword_match_tags_keyword_match_tag` DROP FOREIGN KEY `FK_35e4bd3742fa9e8d8f1d5008977`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_match_tags_keyword_match_tag` DROP FOREIGN KEY `FK_7ab8ffdb544a1fdc1506a537596`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_35e4bd3742fa9e8d8f1d500897` ON `keyword_match_tags_keyword_match_tag`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_7ab8ffdb544a1fdc1506a53759` ON `keyword_match_tags_keyword_match_tag`'
    );
    await queryRunner.query(
      'DROP TABLE `keyword_match_tags_keyword_match_tag`'
    );
    await queryRunner.query('DROP TABLE `keyword_match_tag`');

    await queryRunner.query(
      'ALTER TABLE `keyword` ADD `matchTagNames` varchar(100) NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `keyword` DROP COLUMN `matchTagNames`'
    );

    await queryRunner.query(
      'CREATE TABLE `keyword_match_tag` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(30) NOT NULL, `order` tinyint UNSIGNED NULL, `isVisible` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `keyword_match_tags_keyword_match_tag` (`keywordId` int NOT NULL, `keywordMatchTagId` int NOT NULL, INDEX `IDX_7ab8ffdb544a1fdc1506a53759` (`keywordId`), INDEX `IDX_35e4bd3742fa9e8d8f1d500897` (`keywordMatchTagId`), PRIMARY KEY (`keywordId`, `keywordMatchTagId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_match_tags_keyword_match_tag` ADD CONSTRAINT `FK_7ab8ffdb544a1fdc1506a537596` FOREIGN KEY (`keywordId`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_match_tags_keyword_match_tag` ADD CONSTRAINT `FK_35e4bd3742fa9e8d8f1d5008977` FOREIGN KEY (`keywordMatchTagId`) REFERENCES `keyword_match_tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
  }
}
