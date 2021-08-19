import { MigrationInterface, QueryRunner } from 'typeorm';

export class replaceUserAvatarImage2Column1629363014204
  implements MigrationInterface
{
  name = 'replaceUserAvatarImage2Column1629363014204';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` DROP FOREIGN KEY `FK_8e9136cf2193264fb5faad5d988`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_8e9136cf2193264fb5faad5d98` ON `user`'
    );

    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `avatarImageKey`');
    await queryRunner.query(
      'ALTER TABLE `user` ADD `avatarUrl` varchar(255) NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `avatarUrl`');
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
}
