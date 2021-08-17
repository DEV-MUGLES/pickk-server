import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemPropertyAndValue1629191919244
  implements MigrationInterface
{
  name = 'AddItemPropertyAndValue1629191919244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `item_property` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(20) NOT NULL, `minorCategoryId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `item_property_value` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(20) NOT NULL, `order` tinyint UNSIGNED NOT NULL DEFAULT '0', `itemPropertyId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );

    await queryRunner.query(
      'ALTER TABLE `item_property` ADD CONSTRAINT `FK_5adab74309e170a067236c83f29` FOREIGN KEY (`minorCategoryId`) REFERENCES `item_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item_property_value` ADD CONSTRAINT `FK_745e3bc17b2f388ae702371c34f` FOREIGN KEY (`itemPropertyId`) REFERENCES `item_property`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_property_value` DROP FOREIGN KEY `FK_745e3bc17b2f388ae702371c34f`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_property` DROP FOREIGN KEY `FK_5adab74309e170a067236c83f29`'
    );

    await queryRunner.query('DROP TABLE `item_property_value`');
    await queryRunner.query('DROP TABLE `item_property`');
  }
}
