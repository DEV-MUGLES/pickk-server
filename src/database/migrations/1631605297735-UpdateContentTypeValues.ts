import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateContentTypeValues1631605297735
  implements MigrationInterface
{
  name = 'UpdateContentTypeValues1631605297735';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `order_item` CHANGE `recommendContentType` `recommendContentType` enum ('Pickk', 'digest', 'look', 'video') NULL"
    );
    await queryRunner.query(
      "UPDATE `order_item` SET `recommendContentType` = 'look' where `order_item`.`recommendContentType` = 'Look'"
    );
    await queryRunner.query(
      "UPDATE `order_item` SET `recommendContentType` = 'digest' where `order_item`.`recommendContentType` = 'Pickk'"
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` CHANGE `recommendContentType` `recommendContentType` enum ('digest', 'look', 'video') NULL"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `order_item` CHANGE `recommendContentType` `recommendContentType` enum ('Pickk', 'digest', 'look', 'video') NULL"
    );
    await queryRunner.query(
      "UPDATE `order_item` SET `recommendContentType` = 'Pickk' where `order_item`.`recommendContentType` = 'digest'"
    );
    await queryRunner.query(
      "UPDATE `order_item` SET `recommendContentType` = 'Look' where `order_item`.`recommendContentType` = 'look'"
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` CHANGE `recommendContentType` `recommendContentType` enum ('Pickk', 'Look') NULL"
    );
  }
}
