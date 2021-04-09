import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSellerCrawlStrategy1617962980745 implements MigrationInterface {
  name = 'AddSellerCrawlStrategy1617962980745';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `seller_crawl_strategy` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `itemLinksSelector` varchar(50) NOT NULL, `baseUrl` varchar(50) NOT NULL, `startPathNamesJoin` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD `crawlStrategyId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_6e1ea2cb14fb71730bcb4a64fea` FOREIGN KEY (`crawlStrategyId`) REFERENCES `seller_crawl_strategy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_6e1ea2cb14fb71730bcb4a64fea`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` DROP COLUMN `crawlStrategyId`'
    );
    await queryRunner.query('DROP TABLE `seller_crawl_strategy`');
  }
}
