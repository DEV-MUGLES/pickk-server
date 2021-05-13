import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBrandImageUrl1620888949548 implements MigrationInterface {
  name = 'AddBrandImageUrl1620888949548';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `brand` ADD `imageUrl` varchar(255) NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `brand` DROP COLUMN `imageUrl`');
  }
}
