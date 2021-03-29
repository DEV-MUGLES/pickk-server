import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBrand1616155355087 implements MigrationInterface {
  name = 'AddBrand1616155355087';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `brand` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `nameKor` varchar(30) NOT NULL, `nameEng` varchar(30) NULL, `description` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `brand`');
  }
}
