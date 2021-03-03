import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1614752237304 implements MigrationInterface {
  name = 'CreateUser1614752237304';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `email` varchar(255) NOT NULL, `name` varchar(255) NULL DEFAULT NULL, `password` varchar(255) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `weight` smallint NULL, `height` smallint NULL, UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`'
    );
    await queryRunner.query('DROP TABLE `user`');
  }
}
