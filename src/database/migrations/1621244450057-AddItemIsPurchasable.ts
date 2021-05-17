import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemIsPurchasable1621244450057 implements MigrationInterface {
  name = 'AddItemIsPurchasable1621244450057';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item` ADD `isPurchasable` tinyint NOT NULL DEFAULT 0'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `isPurchasable`');
  }
}
