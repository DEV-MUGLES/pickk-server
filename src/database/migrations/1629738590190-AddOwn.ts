import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOwn1629738590190 implements MigrationInterface {
  name = 'AddOwn1629738590190';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `own` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userId` int NULL, `keywordId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );

    await queryRunner.query(
      'ALTER TABLE `own` ADD CONSTRAINT `FK_a378d5b3b4375043c504affeabc` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `own` ADD CONSTRAINT `FK_a12c6fb849e22a2dc8ca18a0692` FOREIGN KEY (`keywordId`) REFERENCES `keyword`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `own` DROP FOREIGN KEY `FK_a12c6fb849e22a2dc8ca18a0692`'
    );
    await queryRunner.query(
      'ALTER TABLE `own` DROP FOREIGN KEY `FK_a378d5b3b4375043c504affeabc`'
    );

    await queryRunner.query('DROP TABLE `own`');
  }
}
