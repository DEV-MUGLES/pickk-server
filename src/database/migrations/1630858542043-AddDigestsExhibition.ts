import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDigestsExhibition1630858542043 implements MigrationInterface {
  name = 'AddDigestsExhibition1630858542043';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `digests_exhibition_digest` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `exhibitionId` int NULL, `digestId` int NULL, `order` smallint NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `digests_exhibition` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );

    await queryRunner.query(
      'ALTER TABLE `digests_exhibition_digest` ADD CONSTRAINT `FK_dee3e7ac54a4e308d04931e03bc` FOREIGN KEY (`exhibitionId`) REFERENCES `digests_exhibition`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `digests_exhibition_digest` ADD CONSTRAINT `FK_08e330cc8fdeb47c976964e4029` FOREIGN KEY (`digestId`) REFERENCES `digest`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `digests_exhibition_digest` DROP FOREIGN KEY `FK_08e330cc8fdeb47c976964e4029`'
    );
    await queryRunner.query(
      'ALTER TABLE `digests_exhibition_digest` DROP FOREIGN KEY `FK_dee3e7ac54a4e308d04931e03bc`'
    );

    await queryRunner.query('DROP TABLE `digests_exhibition`');
    await queryRunner.query('DROP TABLE `digests_exhibition_digest`');
  }
}
