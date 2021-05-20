import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemSizeChart1621511054688 implements MigrationInterface {
  name = 'AddItemSizeChart1621511054688';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `item_size_chart` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `totalLength` float NULL DEFAULT NULL, `shoulderWidth` float NULL DEFAULT NULL, `chestWidth` float NULL DEFAULT NULL, `sleeveLength` float NULL DEFAULT NULL, `waistWidth` float NULL DEFAULT NULL, `riseHeight` float NULL DEFAULT NULL, `thighWidth` float NULL DEFAULT NULL, `hemWidth` float NULL DEFAULT NULL, `accWidth` float NULL DEFAULT NULL, `accHeight` float NULL DEFAULT NULL, `accDepth` float NULL DEFAULT NULL, `crossStrapLength` float NULL DEFAULT NULL, `watchBandDepth` float NULL DEFAULT NULL, `glassWidth` float NULL DEFAULT NULL, `glassBridgeLength` float NULL DEFAULT NULL, `glassLegLength` float NULL DEFAULT NULL, `itemId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `item_size_chart` ADD CONSTRAINT `FK_f19e44c9f3cb1b30dce76f9b84e` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_size_chart` DROP FOREIGN KEY `FK_f19e44c9f3cb1b30dce76f9b84e`'
    );
    await queryRunner.query('DROP TABLE `item_size_chart`');
  }
}
