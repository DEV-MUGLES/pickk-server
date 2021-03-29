import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSaleStrategy1616946880202 implements MigrationInterface {
  name = 'AddSaleStrategy1616946880202';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `sale_strategy` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `canUseCoupon` tinyint NOT NULL, `canUseMileage` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD `saleStrategyId` int NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_5673d465e89fe9283d00fe5b4da` FOREIGN KEY (`saleStrategyId`) REFERENCES `sale_strategy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_5673d465e89fe9283d00fe5b4da`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` DROP COLUMN `saleStrategyId`'
    );
    await queryRunner.query('DROP TABLE `sale_strategy`');
  }
}
