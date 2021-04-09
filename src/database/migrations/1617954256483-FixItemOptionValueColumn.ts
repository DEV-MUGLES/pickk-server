import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixItemOptionValueColumn1617954256483
  implements MigrationInterface {
  name = 'FixItemOptionValueColumn1617954256483';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_option_value` DROP FOREIGN KEY `FK_fd3b3c7bc62c184c8f2889caf77`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_option_value` CHANGE `itemId` `itemOptionId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item_option_value` ADD CONSTRAINT `FK_61cf3898eff489ea9e5b86e383b` FOREIGN KEY (`itemOptionId`) REFERENCES `item_option`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_option_value` DROP FOREIGN KEY `FK_61cf3898eff489ea9e5b86e383b`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_option_value` CHANGE `itemOptionId` `itemId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item_option_value` ADD CONSTRAINT `FK_fd3b3c7bc62c184c8f2889caf77` FOREIGN KEY (`itemId`) REFERENCES `item_option`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }
}
