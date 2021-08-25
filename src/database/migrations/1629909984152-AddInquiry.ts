import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInquiry1629909984152 implements MigrationInterface {
  name = 'AddInquiry1629909984152';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `inquiry_answer` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `from` enum ('seller', 'super') NOT NULL, `displayAuthor` varchar(30) NOT NULL, `content` varchar(255) NOT NULL, `inquiryId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `inquiry` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `itemId` int NULL, `sellerId` int NULL, `orderItemMerchantUid` char NULL, `type` enum ('ship', 'size', 'restock', 'etc') NOT NULL, `title` varchar(100) NOT NULL, `content` varchar(255) NOT NULL, `contactPhoneNumber` char(11) NOT NULL, `isSecret` tinyint NOT NULL, `isAnswered` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );

    await queryRunner.query(
      'ALTER TABLE `inquiry_answer` ADD CONSTRAINT `FK_8815604b164e0c4a9a158c3d9b7` FOREIGN KEY (`inquiryId`) REFERENCES `inquiry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry_answer` ADD CONSTRAINT `FK_16d3c3c32df94451ca954db5453` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );

    await queryRunner.query(
      'ALTER TABLE `inquiry` ADD CONSTRAINT `FK_7806c6fea3e0ff475bb422ba0c0` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry` ADD CONSTRAINT `FK_5defbf3c37097863e15d8cc4663` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry` ADD CONSTRAINT `FK_0f4729ebc4aa62cb8d0623709e6` FOREIGN KEY (`sellerId`) REFERENCES `seller`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry` ADD CONSTRAINT `FK_d07525dde1dd19d2190b8279191` FOREIGN KEY (`orderItemMerchantUid`) REFERENCES `order_item`(`merchantUid`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `inquiry` DROP FOREIGN KEY `FK_d07525dde1dd19d2190b8279191`'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry` DROP FOREIGN KEY `FK_0f4729ebc4aa62cb8d0623709e6`'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry` DROP FOREIGN KEY `FK_5defbf3c37097863e15d8cc4663`'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry` DROP FOREIGN KEY `FK_7806c6fea3e0ff475bb422ba0c0`'
    );

    await queryRunner.query(
      'ALTER TABLE `inquiry_answer` DROP FOREIGN KEY `FK_16d3c3c32df94451ca954db5453`'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry_answer` DROP FOREIGN KEY `FK_8815604b164e0c4a9a158c3d9b7`'
    );

    await queryRunner.query('DROP TABLE `inquiry`');
    await queryRunner.query('DROP TABLE `inquiry_answer`');
  }
}
