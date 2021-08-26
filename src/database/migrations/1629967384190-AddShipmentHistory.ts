import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddShipmentHistory1629967384190 implements MigrationInterface {
  name = 'AddShipmentHistory1629967384190';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `shipment_history` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `statusText` varchar(20) NOT NULL, `locationName` varchar(20) NOT NULL, `time` datetime NOT NULL, `shipmentId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `shipment_history` ADD CONSTRAINT `FK_727d8ee6eb73b8483634769fb20` FOREIGN KEY (`shipmentId`) REFERENCES `shipment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `shipment_history` DROP FOREIGN KEY `FK_727d8ee6eb73b8483634769fb20`'
    );
    await queryRunner.query('DROP TABLE `shipment_history`');
  }
}
