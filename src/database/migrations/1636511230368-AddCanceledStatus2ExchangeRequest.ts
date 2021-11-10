import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCanceledStatus2ExchangeRequest1636511230368
  implements MigrationInterface {
  name = 'AddCanceledStatus2ExchangeRequest1636511230368';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`exchange_request\` ADD \`cancelReason\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`exchange_request\` ADD \`canceledAt\` datetime NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`exchange_request\` CHANGE \`status\` \`status\` enum ('Pending', 'Requested', 'Picked', 'Reshipping', 'Reshipped', 'Rejected', 'Converted', 'Canceled') NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE \`pickk_dev\`.\`exchange_request\` SET \`status\` = 'Rejected', rejectedAt = canceledAt, rejectReason = cancelReason WHERE \`status\` = 'Canceled'`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`exchange_request\` CHANGE \`status\` \`status\` enum ('Pending', 'Requested', 'Picked', 'Reshipping', 'Reshipped', 'Rejected', 'Converted') NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`exchange_request\` DROP COLUMN \`canceledAt\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`exchange_request\` DROP COLUMN \`cancelReason\``
    );
  }
}
