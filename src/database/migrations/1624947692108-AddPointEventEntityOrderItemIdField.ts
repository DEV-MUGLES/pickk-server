import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPointEventEntityOrderItemIdField1624947692108
  implements MigrationInterface
{
  name = 'AddPointEventEntityOrderItemIdField1624947692108';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `point_event` ADD `orderItemId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `point_event` CHANGE `orderId` `orderId` int NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `point_event` CHANGE `orderId` `orderId` int NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `point_event` DROP COLUMN `orderItemId`'
    );
  }
}
