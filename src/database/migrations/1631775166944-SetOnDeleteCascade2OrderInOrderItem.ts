import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetOnDeleteCascade2OrderInOrderItem1631775166944
  implements MigrationInterface
{
  name = 'SetOnDeleteCascade2OrderInOrderItem1631775166944';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`order_item\` DROP FOREIGN KEY \`FK_cfa63773c75aa44395ebcd491ff\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`order_item\` ADD CONSTRAINT \`FK_cfa63773c75aa44395ebcd491ff\` FOREIGN KEY (\`orderMerchantUid\`) REFERENCES \`pickk_dev\`.\`order\`(\`merchantUid\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`order_item\` DROP FOREIGN KEY \`FK_cfa63773c75aa44395ebcd491ff\``
    );
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`order_item\` ADD CONSTRAINT \`FK_cfa63773c75aa44395ebcd491ff\` FOREIGN KEY (\`orderMerchantUid\`) REFERENCES \`pickk_dev\`.\`order\`(\`merchantUid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
