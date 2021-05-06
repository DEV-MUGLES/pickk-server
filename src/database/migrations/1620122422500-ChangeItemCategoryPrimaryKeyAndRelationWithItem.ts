import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeItemCategoryPrimaryKeyAndRelationWithItem1620122422500
  implements MigrationInterface {
  name = 'ChangeItemCategoryPrimaryKeyAndRelationWithItem1620122422500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `FK_2aa99b101de6fb5f3089bd4b7a9` ON `shipping_address`'
    );
    await queryRunner.query(
      'DROP INDEX `FK_0008b48ab8799d2a86e76ae53f3` ON `seller`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` CHANGE `code` `code` varchar(10) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` ADD PRIMARY KEY (`code`)'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` ADD CONSTRAINT `FK_aab644b409a436f57a3e4bd547e` FOREIGN KEY (`parentCode`) REFERENCES `item_category`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_ba652e7b4350313a9e45c370d31` FOREIGN KEY (`major_category_code`) REFERENCES `item_category`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_47fdc1610a525da75a9dc0e8a1b` FOREIGN KEY (`minor_category_code`) REFERENCES `item_category`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` ADD CONSTRAINT `FK_2aa99b101de6fb5f3089bd4b7a9` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_0008b48ab8799d2a86e76ae53f3` FOREIGN KEY (`courierId`) REFERENCES `courier`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_0008b48ab8799d2a86e76ae53f3`'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` DROP FOREIGN KEY `FK_2aa99b101de6fb5f3089bd4b7a9`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_47fdc1610a525da75a9dc0e8a1b`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_ba652e7b4350313a9e45c370d31`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` DROP FOREIGN KEY `FK_aab644b409a436f57a3e4bd547e`'
    );
    await queryRunner.query('ALTER TABLE `item_category` DROP PRIMARY KEY');
    await queryRunner.query(
      'ALTER TABLE `item_category` CHANGE `code` `code` varchar(10) NOT NULL'
    );
    await queryRunner.query(
      'CREATE INDEX `FK_0008b48ab8799d2a86e76ae53f3` ON `seller` (`courierId`)'
    );
    await queryRunner.query(
      'CREATE INDEX `FK_2aa99b101de6fb5f3089bd4b7a9` ON `shipping_address` (`userId`)'
    );
  }
}
