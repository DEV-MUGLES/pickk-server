import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserAvatarImage1616601183926 implements MigrationInterface {
  name = 'AddUserAvatarImage1616601183926';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `user_avatar_image` (`key` varchar(75) NOT NULL, `angle` int NOT NULL DEFAULT '0', `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`key`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `avatarImageKey` varchar(75) NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_8e9136cf2193264fb5faad5d98` ON `user` (`avatarImageKey`)'
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD CONSTRAINT `FK_8e9136cf2193264fb5faad5d988` FOREIGN KEY (`avatarImageKey`) REFERENCES `user_avatar_image`(`key`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` DROP FOREIGN KEY `FK_8e9136cf2193264fb5faad5d988`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_8e9136cf2193264fb5faad5d98` ON `user`'
    );
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `avatarImageKey`');
    await queryRunner.query('DROP TABLE `user_avatar_image`');
  }
}
