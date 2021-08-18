import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVideo1629272417135 implements MigrationInterface {
  name = 'AddVideo1629272417135';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `video` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `youtubeCode` varchar(40) NOT NULL, `title` varchar(127) NOT NULL, `likeCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `hitCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `commentCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `score` float NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'ALTER TABLE `video` ADD CONSTRAINT `FK_74e27b13f8ac66f999400df12f6` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );

    await queryRunner.query('ALTER TABLE `digest` ADD `videoId` int NULL');
    await queryRunner.query(
      'ALTER TABLE `digest` ADD CONSTRAINT `FK_d4778a767502d9b4fa6a1cd8bec` FOREIGN KEY (`videoId`) REFERENCES `video`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `digest` DROP FOREIGN KEY `FK_d4778a767502d9b4fa6a1cd8bec`'
    );
    await queryRunner.query('ALTER TABLE `digest` DROP COLUMN `videoId`');

    await queryRunner.query(
      'ALTER TABLE `video` DROP FOREIGN KEY `FK_74e27b13f8ac66f999400df12f6`'
    );
    await queryRunner.query('DROP TABLE `video`');
  }
}
