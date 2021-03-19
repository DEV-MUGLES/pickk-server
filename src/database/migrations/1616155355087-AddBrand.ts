import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBrand1616155355087 implements MigrationInterface {
  name = 'AddBrand1616155355087';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `brand` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `nameKor` varchar(30) NOT NULL, `nameEng` varchar(30) NULL DEFAULT NULL, `description` varchar(255) NULL DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `courier` CHANGE `issueMessage` `issueMessage` varchar(255) NULL DEFAULT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `courier` CHANGE `issueEndat` `issueEndat` timestamp NULL DEFAULT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `code` `code` varchar(15) NULL DEFAULT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `code` `code` varchar(15) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `courier` CHANGE `issueEndat` `issueEndat` timestamp NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `courier` CHANGE `issueMessage` `issueMessage` varchar(255) NULL'
    );
    await queryRunner.query('DROP TABLE `brand`');
  }
}
