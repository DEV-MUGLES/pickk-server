import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLook1629291322860 implements MigrationInterface {
  name = 'AddLook1629291322860';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `look` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `title` varchar(127) NOT NULL, `likeCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `hitCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `commentCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `score` float NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `look_image` (`key` varchar(75) NOT NULL, `angle` int NOT NULL DEFAULT '0', `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `lookId` int NULL, PRIMARY KEY (`key`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `look_style_tags_style_tag` (`lookId` int NOT NULL, `styleTagId` int NOT NULL, INDEX `IDX_55a0329aa173c7404338358987` (`lookId`), INDEX `IDX_70c58ab5f8a4106e4598b05471` (`styleTagId`), PRIMARY KEY (`lookId`, `styleTagId`)) ENGINE=InnoDB'
    );

    await queryRunner.query('ALTER TABLE `digest` ADD `lookId` int NULL');
    await queryRunner.query(
      'ALTER TABLE `digest` ADD CONSTRAINT `FK_2a68d8ccbca72ce0834f309ac77` FOREIGN KEY (`lookId`) REFERENCES `look`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );

    await queryRunner.query(
      'ALTER TABLE `look` ADD CONSTRAINT `FK_bd61f80f0ee2f3184f7abd2fe6b` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `look_image` ADD CONSTRAINT `FK_f70ed6310d1a5b6a546343bc684` FOREIGN KEY (`lookId`) REFERENCES `look`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );

    await queryRunner.query(
      'ALTER TABLE `look_style_tags_style_tag` ADD CONSTRAINT `FK_55a0329aa173c74043383589878` FOREIGN KEY (`lookId`) REFERENCES `look`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `look_style_tags_style_tag` ADD CONSTRAINT `FK_70c58ab5f8a4106e4598b05471a` FOREIGN KEY (`styleTagId`) REFERENCES `style_tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `look_style_tags_style_tag` DROP FOREIGN KEY `FK_70c58ab5f8a4106e4598b05471a`'
    );
    await queryRunner.query(
      'ALTER TABLE `look_style_tags_style_tag` DROP FOREIGN KEY `FK_55a0329aa173c74043383589878`'
    );

    await queryRunner.query(
      'ALTER TABLE `look_image` DROP FOREIGN KEY `FK_f70ed6310d1a5b6a546343bc684`'
    );
    await queryRunner.query(
      'ALTER TABLE `look` DROP FOREIGN KEY `FK_bd61f80f0ee2f3184f7abd2fe6b`'
    );

    await queryRunner.query(
      'ALTER TABLE `digest` DROP FOREIGN KEY `FK_2a68d8ccbca72ce0834f309ac77`'
    );
    await queryRunner.query('ALTER TABLE `digest` DROP COLUMN `lookId`');

    await queryRunner.query(
      'DROP INDEX `IDX_70c58ab5f8a4106e4598b05471` ON `look_style_tags_style_tag`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_55a0329aa173c7404338358987` ON `look_style_tags_style_tag`'
    );
    await queryRunner.query('DROP TABLE `look_style_tags_style_tag`');
    await queryRunner.query('DROP TABLE `look_image`');
    await queryRunner.query('DROP TABLE `look`');
  }
}
