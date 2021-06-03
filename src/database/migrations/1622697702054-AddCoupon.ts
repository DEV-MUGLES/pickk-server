import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoupon1622697702054 implements MigrationInterface {
  name = 'AddCoupon1622697702054';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `coupon_specification` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `brandId` int NULL, `name` varchar(30) NOT NULL, `type` enum ('Rate', 'Amount') NOT NULL, `discountRate` tinyint UNSIGNED NULL, `discountAmount` mediumint UNSIGNED NULL, `minimumForUse` mediumint UNSIGNED NULL, `maximumDiscountPrice` mediumint UNSIGNED NULL, `availableAt` datetime NULL, `expireAt` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `coupon` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NOT NULL, `specId` int NOT NULL, `status` enum ('Ready', 'Applied') NOT NULL DEFAULT 'Ready', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'ALTER TABLE `coupon_specification` ADD CONSTRAINT `FK_4fd0c6578a6d5696af065861afe` FOREIGN KEY (`brandId`) REFERENCES `brand`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `coupon` ADD CONSTRAINT `FK_03de14bf5e5b4410fced2ca9935` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `coupon` ADD CONSTRAINT `FK_9381719063f5a017b5b07c99460` FOREIGN KEY (`specId`) REFERENCES `coupon_specification`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `coupon` DROP FOREIGN KEY `FK_9381719063f5a017b5b07c99460`'
    );
    await queryRunner.query(
      'ALTER TABLE `coupon` DROP FOREIGN KEY `FK_03de14bf5e5b4410fced2ca9935`'
    );
    await queryRunner.query(
      'ALTER TABLE `coupon_specification` DROP FOREIGN KEY `FK_4fd0c6578a6d5696af065861afe`'
    );
    await queryRunner.query('DROP TABLE `coupon`');
    await queryRunner.query('DROP TABLE `coupon_specification`');
  }
}
