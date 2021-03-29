import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSellerShippingPolicy1616955347096
  implements MigrationInterface {
  name = 'AddSellerShippingPolicy1616955347096';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `seller_shipping_policy` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `minimumAmountForFree` mediumint NOT NULL, `fee` mediumint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD `shippingPolicyId` int NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_277d5d0fb02ea335bb361b6d5c` ON `seller` (`shippingPolicyId`)'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_277d5d0fb02ea335bb361b6d5c3` FOREIGN KEY (`shippingPolicyId`) REFERENCES `seller_shipping_policy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_277d5d0fb02ea335bb361b6d5c3`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_277d5d0fb02ea335bb361b6d5c` ON `seller`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` DROP COLUMN `shippingPolicyId`'
    );
    await queryRunner.query('DROP TABLE `seller_shipping_policy`');
  }
}
