import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveBaseEntity1615810646168 implements MigrationInterface {
  name = 'RemoveBaseEntity1615810646168';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `code` `code` varchar(255) NULL DEFAULT NULL'
    );
    await queryRunner.query('DROP TABLE `base_entity`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `code` `code` varchar(255) NULL'
    );
    await queryRunner.query(
      'CREATE TABLE `base_entity` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
  }
}
