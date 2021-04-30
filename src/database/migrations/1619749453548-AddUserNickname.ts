import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserNickname1619749453548 implements MigrationInterface {
  name = 'AddUserNickname1619749453548';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` ADD `nickname` varchar(11) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD UNIQUE INDEX `IDX_e2364281027b926b879fa2fa1e` (`nickname`)'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `name` `name` varchar(15) NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `name` `name` varchar(15) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` DROP INDEX `IDX_e2364281027b926b879fa2fa1e`'
    );
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `nickname`');
  }
}
