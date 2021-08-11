import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrderOrderItemColumns1628665900246
  implements MigrationInterface
{
  name = 'UpdateOrderOrderItemColumns1628665900246';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_42d59a472a186142e499b22fac6`'
    );

    await queryRunner.query('ALTER TABLE `order_item` DROP COLUMN `courierId`');
    await queryRunner.query('ALTER TABLE `order_item` DROP COLUMN `trackCode`');

    await queryRunner.query(
      'ALTER TABLE `order_receiver` ADD `message` varchar(50) NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `order_receiver` DROP COLUMN `message`'
    );

    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `trackCode` varchar(30) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `courierId` int NULL'
    );

    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_42d59a472a186142e499b22fac6` FOREIGN KEY (`courierId`) REFERENCES `courier`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }
}
