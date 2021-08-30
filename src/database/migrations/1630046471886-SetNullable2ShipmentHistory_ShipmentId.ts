import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetNullable2ShipmentHistoryShipmentId1630046471886
  implements MigrationInterface
{
  name = 'SetNullable2ShipmentHistoryShipmentId1630046471886';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `shipment_history` DROP FOREIGN KEY `FK_727d8ee6eb73b8483634769fb20`'
    );
    await queryRunner.query(
      'ALTER TABLE `shipment_history` CHANGE `shipmentId` `shipmentId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `shipment_history` ADD CONSTRAINT `FK_727d8ee6eb73b8483634769fb20` FOREIGN KEY (`shipmentId`) REFERENCES `shipment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `shipment_history` DROP FOREIGN KEY `FK_727d8ee6eb73b8483634769fb20`'
    );
    await queryRunner.query(
      'ALTER TABLE `shipment_history` CHANGE `shipmentId` `shipmentId` int NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `shipment_history` ADD CONSTRAINT `FK_727d8ee6eb73b8483634769fb20` FOREIGN KEY (`shipmentId`) REFERENCES `shipment`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }
}
