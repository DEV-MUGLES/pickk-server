import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRole1616127621583 implements MigrationInterface {
  name = 'AddUserRole1616127621583';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user` ADD `role` enum ('user', 'editor', 'seller', 'admin') NOT NULL DEFAULT 'user'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `role`');
  }
}
