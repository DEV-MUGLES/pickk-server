import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSizeChart1621320566542 implements MigrationInterface {
  name = 'AddSizeChart1621320566542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `size_chart` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `totalLength` float UNSIGNED NULL DEFAULT NULL, `shoulderWidth` float UNSIGNED NULL DEFAULT NULL, `chestWidth` float UNSIGNED NULL DEFAULT NULL, `sleeveLength` float UNSIGNED NULL DEFAULT NULL, `waistWidth` float UNSIGNED NULL DEFAULT NULL, `riseHeight` float UNSIGNED NULL DEFAULT NULL, `thighWidth` float UNSIGNED NULL DEFAULT NULL, `hemWidth` float UNSIGNED NULL DEFAULT NULL, `accWidth` float UNSIGNED NULL DEFAULT NULL, `accHeight` float UNSIGNED NULL DEFAULT NULL, `accDepth` float UNSIGNED NULL DEFAULT NULL, `crossStrapLength` float UNSIGNED NULL DEFAULT NULL, `watchBandDepth` float UNSIGNED NULL DEFAULT NULL, `glassWidth` float UNSIGNED NULL DEFAULT NULL, `glassBridgeLength` float UNSIGNED NULL DEFAULT NULL, `glassLegLength` float UNSIGNED NULL DEFAULT NULL, `itemId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `size_chart` ADD CONSTRAINT `FK_71c13e0c585050d31f02280d416` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `size_chart` DROP FOREIGN KEY `FK_71c13e0c585050d31f02280d416`'
    );
    await queryRunner.query('DROP TABLE `size_chart`');
  }
}
