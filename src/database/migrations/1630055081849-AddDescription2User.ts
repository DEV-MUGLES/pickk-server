import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescription2User1630055081849 implements MigrationInterface {
  name = 'AddDescription2User1630055081849';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` ADD `description` varchar(255) NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `description`');
  }
}
