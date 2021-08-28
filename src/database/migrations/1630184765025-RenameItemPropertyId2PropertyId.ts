import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameItemPropertyId2PropertyId1630184765025
  implements MigrationInterface
{
  name = 'RenameItemPropertyId2PropertyId1630184765025';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_property_value\` DROP FOREIGN KEY \`FK_745e3bc17b2f388ae702371c34f\``
    );

    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_property_value\` CHANGE \`itemPropertyId\` \`propertyId\` int NULL`
    );

    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_property_value\` ADD CONSTRAINT \`FK_6c99732cbdc0ece066e64eb4c7c\` FOREIGN KEY (\`propertyId\`) REFERENCES \`pickk_dev\`.\`item_property\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_property_value\` DROP FOREIGN KEY \`FK_6c99732cbdc0ece066e64eb4c7c\``
    );

    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_property_value\` CHANGE \`propertyId\` \`itemPropertyId\` int NULL`
    );

    await queryRunner.query(
      `ALTER TABLE \`pickk_dev\`.\`item_property_value\` ADD CONSTRAINT \`FK_745e3bc17b2f388ae702371c34f\` FOREIGN KEY (\`itemPropertyId\`) REFERENCES \`pickk_dev\`.\`item_property\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }
}
