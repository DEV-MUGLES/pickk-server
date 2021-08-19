import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLike1629358330799 implements MigrationInterface {
  name = 'AddLike1629358330799';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `like` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userId` int NULL, `ownerType` enum ('digest', 'look', 'video', 'comment') NOT NULL, `ownerId` int UNSIGNED NOT NULL, INDEX `idx_ownerId-id` (`ownerId`, `id`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );

    await queryRunner.query(
      'ALTER TABLE `like` ADD CONSTRAINT `FK_e8fb739f08d47955a39850fac23` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `like` DROP FOREIGN KEY `FK_e8fb739f08d47955a39850fac23`'
    );

    await queryRunner.query('DROP INDEX `idx_ownerId-id` ON `like`');
    await queryRunner.query('DROP TABLE `like`');
  }
}
