import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateInquiry1631304293154 implements MigrationInterface {
  name = 'UpdateInquiry1631304293154';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `inquiry_answer` CHANGE `from` `from` enum ('seller', 'super', 'ROOT') NOT NULL"
    );
    await queryRunner.query(
      "UPDATE `inquiry_answer` SET `from` = CASE WHEN `from` = 'seller' THEN 'SELLER' WHEN `from` = 'super' THEN 'ROOT' END"
    );
    await queryRunner.query(
      "ALTER TABLE `inquiry_answer` CHANGE `from` `from` enum ('SELLER', 'ROOT') NOT NULL"
    );

    await queryRunner.query(
      'CREATE INDEX `idx_createdAt` ON `inquiry` (`created_at`)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `idx_createdAt` ON `inquiry`');

    await queryRunner.query(
      "ALTER TABLE `inquiry_answer` CHANGE `from` `from` enum ('super', 'SELLER', 'ROOT') NOT NULL"
    );
    await queryRunner.query(
      "UPDATE `inquiry_answer` SET `from` = CASE WHEN `from` = 'SELLER' THEN 'seller' WHEN `from` = 'ROOT' THEN 'super' END"
    );
    await queryRunner.query(
      "ALTER TABLE `inquiry_answer` CHANGE `from` `from` enum ('seller', 'super') NOT NULL"
    );
  }
}
