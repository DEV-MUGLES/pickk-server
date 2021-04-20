import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserOauth1618908488386 implements MigrationInterface {
  name = 'AddUserOauth1618908488386';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `idx_email` ON `user`');
    await queryRunner.query(
      "ALTER TABLE `user` ADD `oauthProvider` enum ('facebook', 'kakao', 'apple') NULL"
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `oauthCode` varchar(255) NULL'
    );
    await queryRunner.query(
      'CREATE INDEX `idx_oauth_code` ON `user` (`oauthCode`)'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_c5f78ad8f82e492c25d07f047a` ON `user` (`code`)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_c5f78ad8f82e492c25d07f047a` ON `user`'
    );
    await queryRunner.query('DROP INDEX `idx_oauth_code` ON `user`');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `oauthCode`');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `oauthProvider`');
    await queryRunner.query(
      'CREATE UNIQUE INDEX `idx_email` ON `user` (`email`)'
    );
  }
}
