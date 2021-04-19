import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemCategory1618824939935 implements MigrationInterface {
  name = 'AddItemCategory1618824939935';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `item_category` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(10) NOT NULL, `code` varchar(10) NOT NULL, `nsleft` int NOT NULL DEFAULT '1', `nsright` int NOT NULL DEFAULT '2', `parentId` int NULL, UNIQUE INDEX `IDX_3776df63b26aee9f2089a70403` (`name`), UNIQUE INDEX `IDX_d07bbc72c8822787efab782a6c` (`code`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` ADD CONSTRAINT `FK_97f8cf61daf55820a4dd514f312` FOREIGN KEY (`parentId`) REFERENCES `item_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `item_category` DROP FOREIGN KEY `FK_97f8cf61daf55820a4dd514f312`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_d07bbc72c8822787efab782a6c` ON `item_category`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_3776df63b26aee9f2089a70403` ON `item_category`'
    );
    await queryRunner.query('DROP TABLE `item_category`');
  }
}
