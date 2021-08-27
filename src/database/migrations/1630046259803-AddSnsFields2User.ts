import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSnsFields2User1630046259803 implements MigrationInterface {
  name = 'AddSnsFields2User1630046259803';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` ADD `instagramCode` varchar(30) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `youtubeUrl` varchar(255) NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `youtubeUrl`');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `instagramCode`');
  }
}
