import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddKeywordClassMatchTag1629711721643
  implements MigrationInterface
{
  name = 'AddKeywordClassMatchTag1629711721643';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `keyword_class` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `type` enum ('trending', 'essential') NOT NULL, `name` varchar(30) NOT NULL, `order` tinyint UNSIGNED NULL, `isVisible` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `keyword_match_tag` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(30) NOT NULL, `order` tinyint UNSIGNED NULL, `isVisible` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `keyword` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(30) NOT NULL, `imageUrl` varchar(255) NOT NULL, `content` varchar(255) NOT NULL, `stylingTip` varchar(255) NOT NULL, `usablityRate` tinyint UNSIGNED NULL, `isVisible` tinyint NOT NULL DEFAULT 1, `likeCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `hitCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `score` float NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `keyword_style_tags_style_tag` (`keywordId` int NOT NULL, `styleTagId` int NOT NULL, INDEX `IDX_d3ba4d2c7db33fb60058df5be9` (`keywordId`), INDEX `IDX_10d76be04071199c762c0621bb` (`styleTagId`), PRIMARY KEY (`keywordId`, `styleTagId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `keyword_looks_look` (`keywordId` int NOT NULL, `lookId` int NOT NULL, INDEX `IDX_076c584979a61294b4d3099455` (`keywordId`), INDEX `IDX_2031f60fdbe0a1df4ca76625eb` (`lookId`), PRIMARY KEY (`keywordId`, `lookId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `keyword_digests_digest` (`keywordId` int NOT NULL, `digestId` int NOT NULL, INDEX `IDX_2eadcba607b668fd3d7eacfe58` (`keywordId`), INDEX `IDX_505aac2646de3168bb120d40da` (`digestId`), PRIMARY KEY (`keywordId`, `digestId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `keyword_match_tags_keyword_match_tag` (`keywordId` int NOT NULL, `keywordMatchTagId` int NOT NULL, INDEX `IDX_7ab8ffdb544a1fdc1506a53759` (`keywordId`), INDEX `IDX_35e4bd3742fa9e8d8f1d500897` (`keywordMatchTagId`), PRIMARY KEY (`keywordId`, `keywordMatchTagId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `keyword_trend_classes_keyword_class` (`keywordId` int NOT NULL, `keywordClassId` int NOT NULL, INDEX `IDX_6ac62bb7cf7a4849a1a542256d` (`keywordId`), INDEX `IDX_d2fc243e213f548157a7a0e4df` (`keywordClassId`), PRIMARY KEY (`keywordId`, `keywordClassId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `keyword_essential_classes_keyword_class` (`keywordId` int NOT NULL, `keywordClassId` int NOT NULL, INDEX `IDX_3936d0a6866d04fafd070a8c49` (`keywordId`), INDEX `IDX_e6aa1896e90b8b07ca6855d2da` (`keywordClassId`), PRIMARY KEY (`keywordId`, `keywordClassId`)) ENGINE=InnoDB'
    );

    await queryRunner.query(
      'ALTER TABLE `keyword_style_tags_style_tag` ADD CONSTRAINT `FK_d3ba4d2c7db33fb60058df5be96` FOREIGN KEY (`keywordId`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_style_tags_style_tag` ADD CONSTRAINT `FK_10d76be04071199c762c0621bb2` FOREIGN KEY (`styleTagId`) REFERENCES `style_tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_looks_look` ADD CONSTRAINT `FK_076c584979a61294b4d3099455d` FOREIGN KEY (`keywordId`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_looks_look` ADD CONSTRAINT `FK_2031f60fdbe0a1df4ca76625eb9` FOREIGN KEY (`lookId`) REFERENCES `look`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_digests_digest` ADD CONSTRAINT `FK_2eadcba607b668fd3d7eacfe58e` FOREIGN KEY (`keywordId`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_digests_digest` ADD CONSTRAINT `FK_505aac2646de3168bb120d40da0` FOREIGN KEY (`digestId`) REFERENCES `digest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_match_tags_keyword_match_tag` ADD CONSTRAINT `FK_7ab8ffdb544a1fdc1506a537596` FOREIGN KEY (`keywordId`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_match_tags_keyword_match_tag` ADD CONSTRAINT `FK_35e4bd3742fa9e8d8f1d5008977` FOREIGN KEY (`keywordMatchTagId`) REFERENCES `keyword_match_tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_trend_classes_keyword_class` ADD CONSTRAINT `FK_6ac62bb7cf7a4849a1a542256dd` FOREIGN KEY (`keywordId`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_trend_classes_keyword_class` ADD CONSTRAINT `FK_d2fc243e213f548157a7a0e4dfb` FOREIGN KEY (`keywordClassId`) REFERENCES `keyword_class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_essential_classes_keyword_class` ADD CONSTRAINT `FK_3936d0a6866d04fafd070a8c490` FOREIGN KEY (`keywordId`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_essential_classes_keyword_class` ADD CONSTRAINT `FK_e6aa1896e90b8b07ca6855d2da3` FOREIGN KEY (`keywordClassId`) REFERENCES `keyword_class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );

    // 좋아요 대상에 Keyword를 추가한다.
    await queryRunner.query(
      "ALTER TABLE `like` CHANGE `ownerType` `ownerType` enum ('digest', 'look', 'video', 'comment', 'keyword') NOT NULL"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 먼저 Keyword에 대한 좋아요를 모두 삭제한다.
    await queryRunner.query("DELETE FROM `like` WHERE `ownerType`='keyword'");
    await queryRunner.query(
      "ALTER TABLE `like` CHANGE `ownerType` `ownerType` enum ('digest', 'look', 'video', 'comment') NOT NULL"
    );

    await queryRunner.query(
      'ALTER TABLE `keyword_essential_classes_keyword_class` DROP FOREIGN KEY `FK_e6aa1896e90b8b07ca6855d2da3`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_essential_classes_keyword_class` DROP FOREIGN KEY `FK_3936d0a6866d04fafd070a8c490`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_trend_classes_keyword_class` DROP FOREIGN KEY `FK_d2fc243e213f548157a7a0e4dfb`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_trend_classes_keyword_class` DROP FOREIGN KEY `FK_6ac62bb7cf7a4849a1a542256dd`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_match_tags_keyword_match_tag` DROP FOREIGN KEY `FK_35e4bd3742fa9e8d8f1d5008977`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_match_tags_keyword_match_tag` DROP FOREIGN KEY `FK_7ab8ffdb544a1fdc1506a537596`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_digests_digest` DROP FOREIGN KEY `FK_505aac2646de3168bb120d40da0`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_digests_digest` DROP FOREIGN KEY `FK_2eadcba607b668fd3d7eacfe58e`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_looks_look` DROP FOREIGN KEY `FK_2031f60fdbe0a1df4ca76625eb9`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_looks_look` DROP FOREIGN KEY `FK_076c584979a61294b4d3099455d`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_style_tags_style_tag` DROP FOREIGN KEY `FK_10d76be04071199c762c0621bb2`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_style_tags_style_tag` DROP FOREIGN KEY `FK_d3ba4d2c7db33fb60058df5be96`'
    );

    await queryRunner.query(
      'DROP INDEX `IDX_e6aa1896e90b8b07ca6855d2da` ON `keyword_essential_classes_keyword_class`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_3936d0a6866d04fafd070a8c49` ON `keyword_essential_classes_keyword_class`'
    );
    await queryRunner.query(
      'DROP TABLE `keyword_essential_classes_keyword_class`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_d2fc243e213f548157a7a0e4df` ON `keyword_trend_classes_keyword_class`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_6ac62bb7cf7a4849a1a542256d` ON `keyword_trend_classes_keyword_class`'
    );
    await queryRunner.query('DROP TABLE `keyword_trend_classes_keyword_class`');
    await queryRunner.query(
      'DROP INDEX `IDX_35e4bd3742fa9e8d8f1d500897` ON `keyword_match_tags_keyword_match_tag`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_7ab8ffdb544a1fdc1506a53759` ON `keyword_match_tags_keyword_match_tag`'
    );
    await queryRunner.query(
      'DROP TABLE `keyword_match_tags_keyword_match_tag`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_505aac2646de3168bb120d40da` ON `keyword_digests_digest`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_2eadcba607b668fd3d7eacfe58` ON `keyword_digests_digest`'
    );
    await queryRunner.query('DROP TABLE `keyword_digests_digest`');
    await queryRunner.query(
      'DROP INDEX `IDX_2031f60fdbe0a1df4ca76625eb` ON `keyword_looks_look`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_076c584979a61294b4d3099455` ON `keyword_looks_look`'
    );
    await queryRunner.query('DROP TABLE `keyword_looks_look`');
    await queryRunner.query(
      'DROP INDEX `IDX_10d76be04071199c762c0621bb` ON `keyword_style_tags_style_tag`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_d3ba4d2c7db33fb60058df5be9` ON `keyword_style_tags_style_tag`'
    );
    await queryRunner.query('DROP TABLE `keyword_style_tags_style_tag`');
    await queryRunner.query('DROP TABLE `keyword`');
    await queryRunner.query('DROP TABLE `keyword_match_tag`');
    await queryRunner.query('DROP TABLE `keyword_class`');
  }
}
