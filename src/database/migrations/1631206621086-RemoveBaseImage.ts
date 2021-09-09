import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveBaseImage1631206621086 implements MigrationInterface {
  name = 'RemoveBaseImage1631206621086';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `base_image`');
    await queryRunner.query('DROP TABLE `user_avatar_image`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `user_avatar_image` (`key` varchar(75) NOT NULL, `angle` int NOT NULL DEFAULT '0', `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`key`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `base_image` (`key` varchar(75) NOT NULL, `angle` int NOT NULL DEFAULT '0', `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`key`)) ENGINE=InnoDB"
    );
  }
}
