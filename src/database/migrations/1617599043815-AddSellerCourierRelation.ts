import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSellerCourierRelation1617599043815
  implements MigrationInterface {
  name = 'AddSellerCourierRelation1617599043815';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller` ADD `courierId` int NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_0008b48ab8799d2a86e76ae53f3` FOREIGN KEY (`courierId`) REFERENCES `courier`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_0008b48ab8799d2a86e76ae53f3`'
    );
    await queryRunner.query('ALTER TABLE `seller` DROP COLUMN `courierId`');
  }
}
