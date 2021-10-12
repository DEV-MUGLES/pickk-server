import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserAppInstallLog1634055463744 implements MigrationInterface {
  name = 'AddUserAppInstallLog1634055463744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `user_app_install_log` (`userId` int NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `REL_b93d8030f66a822ed3e57669e4` (`userId`), PRIMARY KEY (`userId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `user_app_install_log` ADD CONSTRAINT `FK_b93d8030f66a822ed3e57669e41` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user_app_install_log` DROP FOREIGN KEY `FK_b93d8030f66a822ed3e57669e41`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_b93d8030f66a822ed3e57669e4` ON `user_app_install_log`'
    );
    await queryRunner.query('DROP TABLE `user_app_install_log`');
  }
}
