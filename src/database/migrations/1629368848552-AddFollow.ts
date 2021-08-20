import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFollow1629368848552 implements MigrationInterface {
  name = 'AddFollow1629368848552';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `follow` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userId` int NULL, `targetId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );

    await queryRunner.query(
      'ALTER TABLE `follow` ADD CONSTRAINT `FK_af9f90ce5e8f66f845ebbcc6f15` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `follow` ADD CONSTRAINT `FK_4bf84f2920a2ef651ec66538d2d` FOREIGN KEY (`targetId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `follow` DROP FOREIGN KEY `FK_4bf84f2920a2ef651ec66538d2d`'
    );
    await queryRunner.query(
      'ALTER TABLE `follow` DROP FOREIGN KEY `FK_af9f90ce5e8f66f845ebbcc6f15`'
    );

    await queryRunner.query('DROP TABLE `follow`');
  }
}
