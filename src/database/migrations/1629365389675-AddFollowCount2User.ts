import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFollowCount2User1629365389675 implements MigrationInterface {
  name = 'AddFollowCount2User1629365389675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user` ADD `followCount` mediumint UNSIGNED NOT NULL DEFAULT '0'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `followCount`');
  }
}
