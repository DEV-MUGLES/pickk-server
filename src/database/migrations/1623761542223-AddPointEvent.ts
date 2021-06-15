import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPointEvent1623761542223 implements MigrationInterface {
  name = 'AddPointEvent1623761542223';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `point_event` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `type` enum ('Add', 'Sub') NOT NULL, `amount` int NOT NULL, `resultBalance` int NOT NULL, `title` varchar(30) NOT NULL, `content` varchar(50) NOT NULL, `orderId` int NOT NULL, `userId` int NOT NULL, INDEX `idx_orderId` (`orderId`), INDEX `id_createdAt` (`userId`, `created_at`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'ALTER TABLE `point_event` ADD CONSTRAINT `FK_9f5f91f3080199d4c4bd35abd00` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `point_event` DROP FOREIGN KEY `FK_9f5f91f3080199d4c4bd35abd00`'
    );
    await queryRunner.query('DROP INDEX `id_createdAt` ON `point_event`');
    await queryRunner.query('DROP INDEX `idx_orderId` ON `point_event`');
    await queryRunner.query('DROP TABLE `point_event`');
  }
}
