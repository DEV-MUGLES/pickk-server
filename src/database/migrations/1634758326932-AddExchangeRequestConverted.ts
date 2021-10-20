import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExchangeRequestConverted1634758326932
  implements MigrationInterface
{
  name = 'AddExchangeRequestConverted1634758326932';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD `convertedAt` datetime NULL'
    );
    await queryRunner.query(
      "ALTER TABLE `exchange_request` CHANGE `status` `status` enum ('Pending', 'Requested', 'Picked', 'Reshipping', 'Reshipped', 'Rejected', 'Converted') NOT NULL"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `exchange_request` CHANGE `status` `status` enum ('Pending', 'Requested', 'Picked', 'Reshipping', 'Reshipped', 'Rejected') NOT NULL"
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP COLUMN `convertedAt`'
    );
  }
}
