import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsDeleted2Product1630480309052 implements MigrationInterface {
  name = 'AddIsDeleted2Product1630480309052';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `product` ADD `isDeleted` tinyint NOT NULL DEFAULT 0'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `product` DROP COLUMN `isDeleted`');
  }
}
