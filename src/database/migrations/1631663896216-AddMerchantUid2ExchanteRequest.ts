import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMerchantUid2ExchanteRequest1631663896216
  implements MigrationInterface
{
  name = 'AddMerchantUid2ExchanteRequest1631663896216';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `exchange_request`');

    await queryRunner.query(
      `CREATE TABLE \`exchange_request\` (\`merchantUid\` char(22) NOT NULL, \`userId\` int NULL, \`productId\` int NULL, \`sellerId\` int NULL, \`pickShipmentId\` int NULL, \`reShipmentId\` int NULL, \`orderItemMerchantUid\` char(20) NOT NULL, \`status\` enum ('requested', 'picked', 'reshipping', 'reshipped', 'rejected') NOT NULL, \`faultOf\` enum ('customer', 'seller') NOT NULL, \`reason\` varchar(255) NOT NULL, \`rejectReason\` varchar(255) NULL, \`shippingFee\` mediumint UNSIGNED NOT NULL, \`quantity\` smallint UNSIGNED NOT NULL, \`itemName\` varchar(255) NOT NULL, \`productVariantName\` varchar(255) NOT NULL, \`isProcessDelaying\` tinyint NOT NULL DEFAULT 0, \`processDelayedAt\` datetime NULL, \`requestedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`pickedAt\` datetime NULL, \`reshippingAt\` datetime NULL, \`reshippedAt\` datetime NULL, \`rejectedAt\` datetime NULL, \`confirmedAt\` datetime NULL, UNIQUE INDEX \`REL_5785dec92cf602ee8cf74df2ac\` (\`pickShipmentId\`), UNIQUE INDEX \`REL_0534dce1cf13b2fb7896022ca6\` (\`reShipmentId\`), UNIQUE INDEX \`REL_51588d4e1b3a94cb09e0363d92\` (\`orderItemMerchantUid\`), PRIMARY KEY (\`merchantUid\`)) ENGINE=InnoDB`
    );

    await queryRunner.query(
      `ALTER TABLE \`exchange_request\` ADD CONSTRAINT \`FK_af4b3e36c73378c6905a030c596\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`exchange_request\` ADD CONSTRAINT \`FK_37ac6cc40a16dcf3cfe71f6aa42\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`exchange_request\` ADD CONSTRAINT \`FK_3b4625c136bee67bb53b886a0ed\` FOREIGN KEY (\`sellerId\`) REFERENCES \`seller\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`exchange_request\` ADD CONSTRAINT \`FK_5785dec92cf602ee8cf74df2acb\` FOREIGN KEY (\`pickShipmentId\`) REFERENCES \`shipment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`exchange_request\` ADD CONSTRAINT \`FK_0534dce1cf13b2fb7896022ca6a\` FOREIGN KEY (\`reShipmentId\`) REFERENCES \`shipment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`exchange_request\` ADD CONSTRAINT \`FK_51588d4e1b3a94cb09e0363d92c\` FOREIGN KEY (\`orderItemMerchantUid\`) REFERENCES \`order_item\`(\`merchantUid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error('이 migration은 revert할 수 없습니다.');

    await queryRunner.query(
      `ALTER TABLE \`exchange_request\` DROP FOREIGN KEY \`FK_51588d4e1b3a94cb09e0363d92c\``
    );
    await queryRunner.query(
      `ALTER TABLE \`exchange_request\` DROP FOREIGN KEY \`FK_0534dce1cf13b2fb7896022ca6a\``
    );
    await queryRunner.query(
      `ALTER TABLE \`exchange_request\` DROP FOREIGN KEY \`FK_5785dec92cf602ee8cf74df2acb\``
    );
    await queryRunner.query(
      `ALTER TABLE \`exchange_request\` DROP FOREIGN KEY \`FK_3b4625c136bee67bb53b886a0ed\``
    );
    await queryRunner.query(
      `ALTER TABLE \`exchange_request\` DROP FOREIGN KEY \`FK_37ac6cc40a16dcf3cfe71f6aa42\``
    );
    await queryRunner.query(
      `ALTER TABLE \`exchange_request\` DROP FOREIGN KEY \`FK_af4b3e36c73378c6905a030c596\``
    );

    await queryRunner.query(
      `DROP INDEX \`REL_51588d4e1b3a94cb09e0363d92\` ON \`exchange_request\``
    );
    await queryRunner.query(
      `DROP INDEX \`REL_0534dce1cf13b2fb7896022ca6\` ON \`exchange_request\``
    );
    await queryRunner.query(
      `DROP INDEX \`REL_5785dec92cf602ee8cf74df2ac\` ON \`exchange_request\``
    );
    await queryRunner.query(`DROP TABLE \`exchange_request\``);
  }
}
