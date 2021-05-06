import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixItemCategoryCode1620287608553 implements MigrationInterface {
  name = 'FixItemCategoryCode1620287608553';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_47fdc1610a525da75a9dc0e8a1b`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_ba652e7b4350313a9e45c370d31`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP COLUMN `major_category_code`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP COLUMN `minor_category_code`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_9909642b5864c20bc5214211446` FOREIGN KEY (`majorCategoryCode`) REFERENCES `item_category`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_3d02cb65b72a5edec012a9cdf69` FOREIGN KEY (`minorCategoryCode`) REFERENCES `item_category`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_3d02cb65b72a5edec012a9cdf69`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_9909642b5864c20bc5214211446`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD `minor_category_code` varchar(10) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD `major_category_code` varchar(10) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_ba652e7b4350313a9e45c370d31` FOREIGN KEY (`major_category_code`) REFERENCES `item_category`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_47fdc1610a525da75a9dc0e8a1b` FOREIGN KEY (`minor_category_code`) REFERENCES `item_category`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }
}
