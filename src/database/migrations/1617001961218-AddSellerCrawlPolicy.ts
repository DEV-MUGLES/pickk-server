import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSellerCrawlPolicy1617001961218 implements MigrationInterface {
  name = 'AddSellerCrawlPolicy1617001961218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `seller_crawl_policy` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `isInspectingNew` tinyint NOT NULL, `isUpdatingSaleItemInfo` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD `crawlPolicyId` int NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_0e0175c4cfd4fd8fc9ea06aacb` ON `seller` (`crawlPolicyId`)'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_0e0175c4cfd4fd8fc9ea06aacb8` FOREIGN KEY (`crawlPolicyId`) REFERENCES `seller_crawl_policy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_0e0175c4cfd4fd8fc9ea06aacb8`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_0e0175c4cfd4fd8fc9ea06aacb` ON `seller`'
    );
    await queryRunner.query('ALTER TABLE `seller` DROP COLUMN `crawlPolicyId`');
    await queryRunner.query('DROP TABLE `seller_crawl_policy`');
  }
}
