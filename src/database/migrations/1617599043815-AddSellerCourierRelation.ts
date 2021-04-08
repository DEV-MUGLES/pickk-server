import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

const COURIER_ID = 'courierId';

export class AddSellerCourierRelation1617599043815
  implements MigrationInterface {
  name = 'AddSellerCourierRelation1617599043815';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'seller',
      new TableColumn({
        name: COURIER_ID,
        type: 'int',
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      'seller',
      new TableForeignKey({
        columnNames: [COURIER_ID],
        referencedColumnNames: ['id'],
        referencedTableName: 'courier',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('seller');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf(COURIER_ID) !== -1
    );
    await queryRunner.dropForeignKey('seller', foreignKey);
    await queryRunner.dropColumn('seller', COURIER_ID);
  }
}
