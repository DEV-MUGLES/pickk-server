import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSellerClaimPolicy1616999931757 implements MigrationInterface {
  name = 'AddSellerClaimPolicy1616999931757';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `seller_claim_policy` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `fee` mediumint NOT NULL, `phoneNumber` char(11) NOT NULL, `picName` varchar(20) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD `claimPolicyId` int NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_66be13247b9f98820ccb541af3` ON `seller` (`claimPolicyId`)'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_66be13247b9f98820ccb541af33` FOREIGN KEY (`claimPolicyId`) REFERENCES `seller_claim_policy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_66be13247b9f98820ccb541af33`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_66be13247b9f98820ccb541af3` ON `seller`'
    );
    await queryRunner.query('ALTER TABLE `seller` DROP COLUMN `claimPolicyId`');
    await queryRunner.query('DROP TABLE `seller_claim_policy`');
  }
}
