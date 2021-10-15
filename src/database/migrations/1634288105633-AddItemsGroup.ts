import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemsGroup1634288105633 implements MigrationInterface {
  name = 'AddItemsGroup1634288105633';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `items_group_item` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `groupId` int NOT NULL, `itemId` int NOT NULL, `order` smallint NOT NULL DEFAULT '0', UNIQUE INDEX `REL_9c2bd912df49aa1a505aec9b19` (`itemId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `items_group` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `items_group_item` ADD CONSTRAINT `FK_53877e625c8c810704aa1563f88` FOREIGN KEY (`groupId`) REFERENCES `items_group`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `items_group_item` ADD CONSTRAINT `FK_9c2bd912df49aa1a505aec9b195` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `items_group_item` DROP FOREIGN KEY `FK_9c2bd912df49aa1a505aec9b195`'
    );
    await queryRunner.query(
      'ALTER TABLE `items_group_item` DROP FOREIGN KEY `FK_53877e625c8c810704aa1563f88`'
    );
    await queryRunner.query('DROP TABLE `items_group`');
    await queryRunner.query(
      'DROP INDEX `REL_9c2bd912df49aa1a505aec9b19` ON `items_group_item`'
    );
    await queryRunner.query('DROP TABLE `items_group_item`');
  }
}
