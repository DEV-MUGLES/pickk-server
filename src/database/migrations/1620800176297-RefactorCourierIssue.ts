import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorCourierIssue1620800176297 implements MigrationInterface {
  name = 'RefactorCourierIssue1620800176297';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `courier_issue` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `message` varchar(255) NOT NULL, `endAt` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );

    await queryRunner.query('ALTER TABLE `courier` DROP COLUMN `issueEndat`');
    await queryRunner.query('ALTER TABLE `courier` DROP COLUMN `issueMessage`');

    await queryRunner.query('ALTER TABLE `courier` ADD `issueId` int NULL');
    await queryRunner.query(
      'ALTER TABLE `courier` ADD UNIQUE INDEX `IDX_9f7b0be627db80955da0fc8597` (`issueId`)'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` CHANGE `courierId` `courierId` int NOT NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_9f7b0be627db80955da0fc8597` ON `courier` (`issueId`)'
    );
    await queryRunner.query(
      'ALTER TABLE `courier` ADD CONSTRAINT `FK_9f7b0be627db80955da0fc85979` FOREIGN KEY (`issueId`) REFERENCES `courier_issue`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `courier` DROP FOREIGN KEY `FK_9f7b0be627db80955da0fc85979`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_9f7b0be627db80955da0fc8597` ON `courier`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` CHANGE `courierId` `courierId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `courier` DROP INDEX `IDX_9f7b0be627db80955da0fc8597`'
    );
    await queryRunner.query('ALTER TABLE `courier` DROP COLUMN `issueId`');

    await queryRunner.query(
      'ALTER TABLE `courier` ADD `issueMessage` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `courier` ADD `issueEndat` timestamp NULL'
    );

    await queryRunner.query('DROP TABLE `courier_issue`');
  }
}
