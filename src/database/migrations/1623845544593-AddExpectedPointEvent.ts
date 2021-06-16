import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExpectedPointEvent1623845544593 implements MigrationInterface {
  name = 'AddExpectedPointEvent1623845544593';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `expected_point_event` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `amount` int NOT NULL, `title` varchar(30) NOT NULL, `content` varchar(50) NOT NULL, `orderId` int NOT NULL, `userId` int NOT NULL, INDEX `idx_orderId` (`orderId`), INDEX `idx_createdAt` (`userId`, `created_at`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `expected_point_event` ADD CONSTRAINT `FK_e9324f8dd28306b3e98c4969f6d` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `expected_point_event` DROP FOREIGN KEY `FK_e9324f8dd28306b3e98c4969f6d`'
    );
    await queryRunner.query(
      'DROP INDEX `idx_createdAt` ON `expected_point_event`'
    );
    await queryRunner.query(
      'DROP INDEX `idx_orderId` ON `expected_point_event`'
    );
    await queryRunner.query('DROP TABLE `expected_point_event`');
  }
}
