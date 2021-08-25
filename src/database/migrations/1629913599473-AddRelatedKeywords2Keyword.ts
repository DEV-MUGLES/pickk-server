import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelatedKeywords2Keyword1629913599473
  implements MigrationInterface
{
  name = 'AddRelatedKeywords2Keyword1629913599473';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `keyword_related_keywords_keyword` (`keywordId_1` int NOT NULL, `keywordId_2` int NOT NULL, INDEX `IDX_95520e40d9086a39c5a8570d25` (`keywordId_1`), INDEX `IDX_ccdfba40a677c7d2bb4083cba5` (`keywordId_2`), PRIMARY KEY (`keywordId_1`, `keywordId_2`)) ENGINE=InnoDB'
    );

    await queryRunner.query(
      'ALTER TABLE `keyword_related_keywords_keyword` ADD CONSTRAINT `FK_95520e40d9086a39c5a8570d259` FOREIGN KEY (`keywordId_1`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_related_keywords_keyword` ADD CONSTRAINT `FK_ccdfba40a677c7d2bb4083cba5a` FOREIGN KEY (`keywordId_2`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `keyword_related_keywords_keyword` DROP FOREIGN KEY `FK_ccdfba40a677c7d2bb4083cba5a`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_related_keywords_keyword` DROP FOREIGN KEY `FK_95520e40d9086a39c5a8570d259`'
    );

    await queryRunner.query(
      'DROP INDEX `IDX_ccdfba40a677c7d2bb4083cba5` ON `keyword_related_keywords_keyword`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_95520e40d9086a39c5a8570d25` ON `keyword_related_keywords_keyword`'
    );
    await queryRunner.query('DROP TABLE `keyword_related_keywords_keyword`');
  }
}
