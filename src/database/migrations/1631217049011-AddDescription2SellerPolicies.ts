import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescription2SellerPolicies1631217049011
  implements MigrationInterface
{
  name = 'AddDescription2SellerPolicies1631217049011';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`seller_claim_policy\` ADD \`description\` varchar(500) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`seller_shipping_policy\` ADD \`description\` varchar(500) NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`seller_shipping_policy\` DROP COLUMN \`description\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`seller_claim_policy\` DROP COLUMN \`description\``
    );
  }
}
