import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddComment1629295789146 implements MigrationInterface {
  name = 'AddComment1629295789146';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `comment` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `ownerType` enum ('digest', 'look', 'video') NOT NULL, `ownerId` int UNSIGNED NOT NULL, `parentId` int NULL, `mentionedUserId` int NULL, `content` varchar(255) NOT NULL, `likeCount` mediumint UNSIGNED NOT NULL DEFAULT '0', INDEX `idx_ownerId-id` (`ownerId`, `id`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );

    await queryRunner.query(
      'ALTER TABLE `comment` ADD CONSTRAINT `FK_c0354a9a009d3bb45a08655ce3b` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `comment` ADD CONSTRAINT `FK_e3aebe2bd1c53467a07109be596` FOREIGN KEY (`parentId`) REFERENCES `comment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `comment` ADD CONSTRAINT `FK_02e7470670d28ed8dd1ecb554db` FOREIGN KEY (`mentionedUserId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `comment` DROP FOREIGN KEY `FK_02e7470670d28ed8dd1ecb554db`'
    );
    await queryRunner.query(
      'ALTER TABLE `comment` DROP FOREIGN KEY `FK_e3aebe2bd1c53467a07109be596`'
    );
    await queryRunner.query(
      'ALTER TABLE `comment` DROP FOREIGN KEY `FK_c0354a9a009d3bb45a08655ce3b`'
    );

    await queryRunner.query('DROP INDEX `idx_ownerId-id` ON `comment`');
    await queryRunner.query('DROP TABLE `comment`');
  }
}
