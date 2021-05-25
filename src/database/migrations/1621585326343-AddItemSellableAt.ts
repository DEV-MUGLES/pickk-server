import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemSellableAt1621585326343 implements MigrationInterface {
  name = 'AddItemSellableAt1621585326343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item` ADD `sellableAt` datetime NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `item` DROP COLUMN `sellableAt`');
  }
}
