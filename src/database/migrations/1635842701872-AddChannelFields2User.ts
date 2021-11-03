import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddChannelFields2User1635842701872 implements MigrationInterface {
  name = 'AddChannelFields2User1635842701872';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` ADD `naverCode` varchar(50) NULL'
    );
    await queryRunner.query(
      "ALTER TABLE `user` ADD `mainChannel` enum ('Youtube', 'Instagram', 'NaverBlog') NULL"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `mainChannel`');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `naverCode`');
  }
}
