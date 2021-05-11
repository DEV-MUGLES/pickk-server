import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorSellerCrawlPolicyStrategy1620712814588
  implements MigrationInterface {
  name = 'RefactorSellerCrawlPolicyStrategy1620712814588';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_policy` CHANGE `isUpdatingSaleItemInfo` `isUpdatingItems` tinyint NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_strategy` DROP COLUMN `itemLinksSelector`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_strategy` ADD `itemsSelector` varchar(50) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_strategy` ADD `codeRegex` varchar(30) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_strategy` ADD `pagination` tinyint NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_strategy` ADD `pageParam` varchar(20) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_strategy` DROP COLUMN `baseUrl`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_strategy` ADD `baseUrl` varchar(75) NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_strategy` DROP COLUMN `baseUrl`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_strategy` ADD `baseUrl` varchar(50) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_strategy` DROP COLUMN `pageParam`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_strategy` DROP COLUMN `pagination`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_strategy` DROP COLUMN `codeRegex`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_strategy` DROP COLUMN `itemsSelector`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_strategy` ADD `itemLinksSelector` varchar(50) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_policy` CHANGE `isUpdatingItems` `isUpdatingSaleItemInfo` tinyint NOT NULL'
    );
  }
}
