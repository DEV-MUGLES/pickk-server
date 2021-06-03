import { MigrationInterface, QueryRunner } from 'typeorm';

export class IncreaseItemCategoryCodeNameSize1622702713491
  implements MigrationInterface {
  name = 'IncreaseItemCategoryCodeNameSize1622702713491';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_d07bbc72c8822787efab782a6c` ON `item_category`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` MODIFY `code` varchar(20) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` ADD UNIQUE INDEX `IDX_d07bbc72c8822787efab782a6c` (`code`)'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_3776df63b26aee9f2089a70403` ON `item_category`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` MODIFY `name` varchar(20) NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_category` MODIFY `name` varchar(10) NOT NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_3776df63b26aee9f2089a70403` ON `item_category` (`name`)'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` DROP INDEX `IDX_d07bbc72c8822787efab782a6c`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` MODIFY `code` varchar(10) NOT NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_d07bbc72c8822787efab782a6c` ON `item_category` (`code`)'
    );
  }
}
