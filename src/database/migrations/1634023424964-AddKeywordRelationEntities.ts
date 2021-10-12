import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddKeywordRelationEntities1634023424964
  implements MigrationInterface
{
  name = 'AddKeywordRelationEntities1634023424964';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `keyword_digest` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `keywordId` int NOT NULL, `digestId` int NOT NULL, `order` smallint NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `keyword_look` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `keywordId` int NOT NULL, `lookId` int NOT NULL, `order` smallint NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_digest` ADD CONSTRAINT `FK_7c523999c25c264c1848fbfa151` FOREIGN KEY (`keywordId`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_digest` ADD CONSTRAINT `FK_a861627f42f161ebb98b95a1b5c` FOREIGN KEY (`digestId`) REFERENCES `digest`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_look` ADD CONSTRAINT `FK_914b22e93bb6f518afaab84db1c` FOREIGN KEY (`keywordId`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_look` ADD CONSTRAINT `FK_2cb3a3e2cccac9cfd92f58cdfba` FOREIGN KEY (`lookId`) REFERENCES `look`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );

    await queryRunner.query(
      'ALTER TABLE `keyword_looks_look` DROP FOREIGN KEY `FK_2031f60fdbe0a1df4ca76625eb9`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_looks_look` DROP FOREIGN KEY `FK_076c584979a61294b4d3099455d`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_2031f60fdbe0a1df4ca76625eb` ON `keyword_looks_look`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_076c584979a61294b4d3099455` ON `keyword_looks_look`'
    );
    await queryRunner.query('DROP TABLE `keyword_looks_look`');

    await queryRunner.query(
      'ALTER TABLE `keyword_digests_digest` DROP FOREIGN KEY `FK_505aac2646de3168bb120d40da0`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_digests_digest` DROP FOREIGN KEY `FK_2eadcba607b668fd3d7eacfe58e`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_505aac2646de3168bb120d40da` ON `keyword_digests_digest`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_2eadcba607b668fd3d7eacfe58` ON `keyword_digests_digest`'
    );
    await queryRunner.query('DROP TABLE `keyword_digests_digest`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `keyword_looks_look` (`keywordId` int NOT NULL, `lookId` int NOT NULL, INDEX `IDX_076c584979a61294b4d3099455` (`keywordId`), INDEX `IDX_2031f60fdbe0a1df4ca76625eb` (`lookId`), PRIMARY KEY (`keywordId`, `lookId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_looks_look` ADD CONSTRAINT `FK_076c584979a61294b4d3099455d` FOREIGN KEY (`keywordId`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_looks_look` ADD CONSTRAINT `FK_2031f60fdbe0a1df4ca76625eb9` FOREIGN KEY (`lookId`) REFERENCES `look`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'CREATE TABLE `keyword_digests_digest` (`keywordId` int NOT NULL, `digestId` int NOT NULL, INDEX `IDX_2eadcba607b668fd3d7eacfe58` (`keywordId`), INDEX `IDX_505aac2646de3168bb120d40da` (`digestId`), PRIMARY KEY (`keywordId`, `digestId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_digests_digest` ADD CONSTRAINT `FK_2eadcba607b668fd3d7eacfe58e` FOREIGN KEY (`keywordId`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_digests_digest` ADD CONSTRAINT `FK_505aac2646de3168bb120d40da0` FOREIGN KEY (`digestId`) REFERENCES `digest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );

    await queryRunner.query(
      'ALTER TABLE `keyword_look` DROP FOREIGN KEY `FK_2cb3a3e2cccac9cfd92f58cdfba`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_look` DROP FOREIGN KEY `FK_914b22e93bb6f518afaab84db1c`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_digest` DROP FOREIGN KEY `FK_a861627f42f161ebb98b95a1b5c`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_digest` DROP FOREIGN KEY `FK_7c523999c25c264c1848fbfa151`'
    );
    await queryRunner.query('DROP TABLE `keyword_look`');
    await queryRunner.query('DROP TABLE `keyword_digest`');
  }
}
