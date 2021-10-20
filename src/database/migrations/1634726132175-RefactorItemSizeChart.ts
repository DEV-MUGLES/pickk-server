import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorItemSizeChart1634726132175 implements MigrationInterface {
  name = 'RefactorItemSizeChart1634726132175';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP FOREIGN KEY \`FK_f19e44c9f3cb1b30dce76f9b84e\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`itemId\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`name\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`totalLength\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`shoulderWidth\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`chestWidth\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`sleeveLength\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`waistWidth\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`riseHeight\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`thighWidth\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`hemWidth\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`accWidth\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`accHeight\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`accDepth\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`crossStrapLength\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`watchBandDepth\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`glassWidth\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`glassBridgeLength\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`glassLegLength\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`labels\` json NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`sizes\` json NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`recommendations\` json NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item\` ADD \`sizeChartId\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item\` ADD UNIQUE INDEX \`IDX_e93b9bdff4cc0fbca5fbde8ca3\` (\`sizeChartId\`)`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_e93b9bdff4cc0fbca5fbde8ca3\` ON \`pickk_dev\`.\`item\` (\`sizeChartId\`)`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item\` ADD CONSTRAINT \`FK_e93b9bdff4cc0fbca5fbde8ca3d\` FOREIGN KEY (\`sizeChartId\`) REFERENCES \`pickk_dev\`.\`item_size_chart\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e93b9bdff4cc0fbca5fbde8ca3\` ON \`pickk_dev\`.\`item\``
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_e93b9bdff4cc0fbca5fbde8ca3\` ON \`pickk_dev\`.\`item\` (\`sizeChartId\`)`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item\` DROP FOREIGN KEY \`FK_e93b9bdff4cc0fbca5fbde8ca3d\``
    );
    await queryRunner.query(
      `DROP INDEX \`REL_e93b9bdff4cc0fbca5fbde8ca3\` ON \`pickk_dev\`.\`item\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item\` DROP INDEX \`IDX_e93b9bdff4cc0fbca5fbde8ca3\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item\` DROP COLUMN \`sizeChartId\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`recommendations\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`sizes\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` DROP COLUMN \`labels\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`glassLegLength\` float(12) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`glassBridgeLength\` float(12) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`glassWidth\` float(12) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`watchBandDepth\` float(12) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`crossStrapLength\` float(12) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`accDepth\` float(12) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`accHeight\` float(12) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`accWidth\` float(12) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`hemWidth\` float(12) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`thighWidth\` float(12) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`riseHeight\` float(12) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`waistWidth\` float(12) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`sleeveLength\` float(12) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`chestWidth\` float(12) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`shoulderWidth\` float(12) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`totalLength\` float(12) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`name\` varchar(255) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD \`itemId\` int NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_size_chart\` ADD CONSTRAINT \`FK_f19e44c9f3cb1b30dce76f9b84e\` FOREIGN KEY (\`itemId\`) REFERENCES \`pickk_dev\`.\`item\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }
}
