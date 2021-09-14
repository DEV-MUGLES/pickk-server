import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveTotalFielsFromOrder1631656308229
  implements MigrationInterface
{
  name = 'RemoveTotalFielsFromOrder1631656308229';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`totalItemFinalPrice\``
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`totalShippingFee\``
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`totalCouponDiscountAmount\``
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`totalUsedPointAmount\``
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`totalPayAmount\``
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`totalPayAmount\` int UNSIGNED NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`totalUsedPointAmount\` int UNSIGNED NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`totalCouponDiscountAmount\` int UNSIGNED NOT NULL DEFAULT '0'`
    );

    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`totalShippingFee\` int UNSIGNED NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` CHANGE \`totalShippingFee\` \`totalShippingFee\` int UNSIGNED NOT NULL`
    );

    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`totalItemFinalPrice\` int UNSIGNED NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` CHANGE \`totalItemFinalPrice\` \`totalItemFinalPrice\` int UNSIGNED NOT NULL`
    );
  }
}
