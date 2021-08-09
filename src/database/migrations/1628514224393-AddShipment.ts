import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddShipment1628514224393 implements MigrationInterface {
  name = 'AddShipment1628514224393';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `shipment` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `status` enum ('shipping', 'shipped', 'cancelled', 'failed') NOT NULL, `ownerType` enum ('exchange_request_pick', 'exchange_request_reship', 'refund_request', 'order_item') NULL, `ownerId` int NULL, `courierId` int NULL, `trackCode` varchar(30) NULL, `lastTrackedAt` datetime NULL, INDEX `idx_status` (`status`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );

    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD `pickShipmentId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD UNIQUE INDEX `IDX_5785dec92cf602ee8cf74df2ac` (`pickShipmentId`)'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD `reShipmentId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD UNIQUE INDEX `IDX_0534dce1cf13b2fb7896022ca6` (`reShipmentId`)'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `shipmentId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD UNIQUE INDEX `IDX_3f11f0bbd532d03ef4d9c44f41` (`shipmentId`)'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD `shipmentId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD UNIQUE INDEX `IDX_9f823dc7c469bc50c123b06ad2` (`shipmentId`)'
    );

    await queryRunner.query(
      'ALTER TABLE `shipment` ADD CONSTRAINT `FK_8c6acef92eca3ea7d987e817649` FOREIGN KEY (`courierId`) REFERENCES `courier`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD CONSTRAINT `FK_5785dec92cf602ee8cf74df2acb` FOREIGN KEY (`pickShipmentId`) REFERENCES `shipment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD CONSTRAINT `FK_0534dce1cf13b2fb7896022ca6a` FOREIGN KEY (`reShipmentId`) REFERENCES `shipment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_3f11f0bbd532d03ef4d9c44f41e` FOREIGN KEY (`shipmentId`) REFERENCES `shipment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD CONSTRAINT `FK_9f823dc7c469bc50c123b06ad28` FOREIGN KEY (`shipmentId`) REFERENCES `shipment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP FOREIGN KEY `FK_9f823dc7c469bc50c123b06ad28`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_3f11f0bbd532d03ef4d9c44f41e`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP FOREIGN KEY `FK_0534dce1cf13b2fb7896022ca6a`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP FOREIGN KEY `FK_5785dec92cf602ee8cf74df2acb`'
    );
    await queryRunner.query(
      'ALTER TABLE `shipment` DROP FOREIGN KEY `FK_8c6acef92eca3ea7d987e817649`'
    );

    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP INDEX `IDX_9f823dc7c469bc50c123b06ad2`'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP COLUMN `shipmentId`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP INDEX `IDX_3f11f0bbd532d03ef4d9c44f41`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `shipmentId`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP INDEX `IDX_0534dce1cf13b2fb7896022ca6`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP COLUMN `reShipmentId`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP INDEX `IDX_5785dec92cf602ee8cf74df2ac`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP COLUMN `pickShipmentId`'
    );
    await queryRunner.query('DROP INDEX `idx_status` ON `shipment`');
    await queryRunner.query('DROP TABLE `shipment`');
  }
}
