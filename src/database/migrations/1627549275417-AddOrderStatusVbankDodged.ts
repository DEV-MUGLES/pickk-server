import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderStatusVbankDodged1627549275417
  implements MigrationInterface
{
  name = 'AddOrderStatusVbankDodged1627549275417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `idx_merchantUid` ON `order`');
    await queryRunner.query(
      'ALTER TABLE `order` ADD `vbankDodgedAt` datetime NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD `vbankDodgedAt` datetime NULL'
    );

    await queryRunner.query(
      "ALTER TABLE `order_item` CHANGE `status` `status` enum ('pending', 'failed', 'vbank_ready', 'vbank_dodged', 'paid', 'ship_pending', 'ship_ready', 'shipping', 'shipped', 'withdrawn') NOT NULL"
    );
    await queryRunner.query(
      "UPDATE `order_item` SET status = 'vbank_dodged' WHERE status = 'withdrawn'"
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` CHANGE `status` `status` enum ('pending', 'failed', 'vbank_ready', 'vbank_dodged', 'paid', 'ship_pending', 'ship_ready', 'shipping', 'shipped') NOT NULL"
    );

    await queryRunner.query(
      "ALTER TABLE `order` CHANGE `status` `status` enum ('pending', 'paying', 'failed', 'vbank_ready', 'vbank_dodged', 'paid', 'withdrawn') NOT NULL"
    );
    await queryRunner.query(
      "UPDATE `order` SET status = 'vbank_dodged' WHERE status = 'withdrawn'"
    );
    await queryRunner.query(
      "ALTER TABLE `order` CHANGE `status` `status` enum ('pending', 'paying', 'failed', 'vbank_ready', 'vbank_dodged', 'paid') NOT NULL"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE INDEX `idx_merchantUid` ON `order` (`merchantUid`)'
    );
    await queryRunner.query('ALTER TABLE `order` DROP COLUMN `vbankDodgedAt`');
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP COLUMN `vbankDodgedAt`'
    );

    await queryRunner.query(
      "ALTER TABLE `order` CHANGE `status` `status` enum ('pending', 'paying', 'failed', 'vbank_ready', 'vbank_dodged', 'paid', 'withdrawn') NOT NULL"
    );
    await queryRunner.query(
      "UPDATE `order` SET status = 'withdrawn' WHERE status = 'vbank_dodged'"
    );
    await queryRunner.query(
      "ALTER TABLE `order` CHANGE `status` `status` enum ('pending', 'paying', 'failed', 'vbank_ready', 'paid', 'withdrawn') NOT NULL"
    );

    await queryRunner.query(
      "ALTER TABLE `order_item` CHANGE `status` `status` enum ('pending', 'failed', 'vbank_ready', 'vbank_dodged', 'paid', 'ship_pending', 'ship_ready', 'shipping', 'shipped', 'withdrawn') NOT NULL"
    );
    await queryRunner.query(
      "UPDATE `order_item` SET status = 'withdrawn' WHERE status = 'vbank_dodged'"
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` CHANGE `status` `status` enum ('pending', 'failed', 'vbank_ready', 'paid', 'withdrawn', 'ship_pending', 'ship_ready', 'shipping', 'shipped') NOT NULL"
    );
  }
}
