import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCartItem1623135853227 implements MigrationInterface {
  name = 'AddCartItem1623135853227';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `cart_item` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `quantity` smallint UNSIGNED NOT NULL DEFAULT '0', `productId` int NOT NULL, `userId` int NOT NULL, INDEX `idx_createdAt` (`created_at`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'ALTER TABLE `cart_item` ADD CONSTRAINT `FK_75db0de134fe0f9fe9e4591b7bf` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `cart_item` ADD CONSTRAINT `FK_158f0325ccf7f68a5b395fa2f6a` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `cart_item` DROP FOREIGN KEY `FK_158f0325ccf7f68a5b395fa2f6a`'
    );
    await queryRunner.query(
      'ALTER TABLE `cart_item` DROP FOREIGN KEY `FK_75db0de134fe0f9fe9e4591b7bf`'
    );
    await queryRunner.query('DROP INDEX `idx_createdAt` ON `cart_item`');
    await queryRunner.query('DROP TABLE `cart_item`');
  }
}
