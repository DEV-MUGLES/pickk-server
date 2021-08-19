import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStyleTags2User1629361641120 implements MigrationInterface {
  name = 'AddStyleTags2User1629361641120';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `user_style_tags_style_tag` (`userId` int NOT NULL, `styleTagId` int NOT NULL, INDEX `IDX_ab5b3f0f96f8c238e8c9b46c12` (`userId`), INDEX `IDX_fc54ad7a80b2c1258b583a8a16` (`styleTagId`), PRIMARY KEY (`userId`, `styleTagId`)) ENGINE=InnoDB'
    );

    await queryRunner.query(
      'ALTER TABLE `user_style_tags_style_tag` ADD CONSTRAINT `FK_ab5b3f0f96f8c238e8c9b46c126` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `user_style_tags_style_tag` ADD CONSTRAINT `FK_fc54ad7a80b2c1258b583a8a164` FOREIGN KEY (`styleTagId`) REFERENCES `style_tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user_style_tags_style_tag` DROP FOREIGN KEY `FK_fc54ad7a80b2c1258b583a8a164`'
    );
    await queryRunner.query(
      'ALTER TABLE `user_style_tags_style_tag` DROP FOREIGN KEY `FK_ab5b3f0f96f8c238e8c9b46c126`'
    );

    await queryRunner.query(
      'DROP INDEX `IDX_fc54ad7a80b2c1258b583a8a16` ON `user_style_tags_style_tag`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_ab5b3f0f96f8c238e8c9b46c12` ON `user_style_tags_style_tag`'
    );
    await queryRunner.query('DROP TABLE `user_style_tags_style_tag`');
  }
}
