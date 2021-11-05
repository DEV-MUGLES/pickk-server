import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsCeleb2User1636097936795 implements MigrationInterface {
  name = 'AddIsCeleb2User1636097936795';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` ADD `isCeleb` tinyint NOT NULL DEFAULT 0'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `isCeleb`');
  }
}
