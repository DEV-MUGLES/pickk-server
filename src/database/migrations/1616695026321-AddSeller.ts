import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSeller1616695026321 implements MigrationInterface {
  name = 'AddSeller1616695026321';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `seller` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `businessName` varchar(255) NOT NULL, `businessCode` char(12) NOT NULL, `mailOrderBusinessCode` varchar(255) NOT NULL, `representativeName` varchar(20) NOT NULL, `phoneNumber` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `kakaoTalkCode` varchar(255) NULL, `operationTimeMessage` varchar(255) NOT NULL, `userId` int NOT NULL, `brandId` int NOT NULL, UNIQUE INDEX `REL_af49645e98a3d39bd4f3591b33` (`userId`), UNIQUE INDEX `REL_e2dea4bd18238e9ab6bd645c9e` (`brandId`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_af49645e98a3d39bd4f3591b334` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_e2dea4bd18238e9ab6bd645c9e3` FOREIGN KEY (`brandId`) REFERENCES `brand`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_e2dea4bd18238e9ab6bd645c9e3`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_af49645e98a3d39bd4f3591b334`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_e2dea4bd18238e9ab6bd645c9e` ON `seller`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_af49645e98a3d39bd4f3591b33` ON `seller`'
    );
    await queryRunner.query('DROP TABLE `seller`');
  }
}
