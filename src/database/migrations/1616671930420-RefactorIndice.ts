import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorIndice1616671930420 implements MigrationInterface {
  name = 'RefactorIndice1616671930420';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_8e9136cf2193264fb5faad5d98` ON `user`'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `email` `email` varchar(255) NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `idx_code` ON `user` (`code`)'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `idx_email` ON `user` (`email`)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `idx_email` ON `user`');
    await queryRunner.query('DROP INDEX `idx_code` ON `user`');
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `email` `email` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_8e9136cf2193264fb5faad5d98` ON `user` (`avatarImageKey`)'
    );
  }
}
