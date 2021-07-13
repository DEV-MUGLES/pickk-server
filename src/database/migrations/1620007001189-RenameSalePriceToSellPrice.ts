import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameSalePriceToSellPrice1620007001189
  implements MigrationInterface
{
  name = 'RenameSalePriceToSellPrice1620007001189';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_d7ee3c98b388714c02efc9fb82` ON `item`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` CHANGE `salePrice` `sellPrice` int NOT NULL'
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_6f204c02cb60cec5f2db151d93` ON `item` (`sellPrice`)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_6f204c02cb60cec5f2db151d93` ON `item`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` CHANGE `sellPrice` `salePrice` int NOT NULL'
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_d7ee3c98b388714c02efc9fb82` ON `item` (`salePrice`)'
    );
  }
}
