import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorItemPrice1621936174290 implements MigrationInterface {
  name = 'RefactorItemPrice1621936174290';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_price` CHANGE `pickkDiscountAmount` `pickkDiscountAmount` mediumint UNSIGNED NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item_price` CHANGE `pickkDiscountRate` `pickkDiscountRate` mediumint UNSIGNED NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_price` CHANGE `pickkDiscountRate` `pickkDiscountRate` mediumint UNSIGNED NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item_price` CHANGE `pickkDiscountAmount` `pickkDiscountAmount` mediumint UNSIGNED NOT NULL'
    );
  }
}
