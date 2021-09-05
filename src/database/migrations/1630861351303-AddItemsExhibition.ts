import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemsExhibition1630861351303 implements MigrationInterface {
  name = 'AddItemsExhibition1630861351303';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `items_exhibition_item` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `exhibitionId` int NULL, `itemId` int NULL, `order` smallint NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `items_exhibition` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );

    await queryRunner.query(
      'ALTER TABLE `items_exhibition_item` ADD CONSTRAINT `FK_2998581fb2a9475625bd51920c2` FOREIGN KEY (`exhibitionId`) REFERENCES `items_exhibition`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `items_exhibition_item` ADD CONSTRAINT `FK_f7fa8a22453d20804506e6e874b` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `items_exhibition_item` DROP FOREIGN KEY `FK_f7fa8a22453d20804506e6e874b`'
    );
    await queryRunner.query(
      'ALTER TABLE `items_exhibition_item` DROP FOREIGN KEY `FK_2998581fb2a9475625bd51920c2`'
    );

    await queryRunner.query('DROP TABLE `items_exhibition`');
    await queryRunner.query('DROP TABLE `items_exhibition_item`');
  }
}
