import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCourier1616124131358 implements MigrationInterface {
  name = 'AddCourier1616124131358';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `courier` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `code` varchar(30) NOT NULL, `name` varchar(20) NOT NULL, `phoneNumber` char(11) NOT NULL, `returnReserveUrl` varchar(300) NOT NULL, `issueEndat` timestamp NULL, `issueMessage` varchar(255) NULL, UNIQUE INDEX `IDX_191d47572c6e09c1598ea39a64` (`code`), UNIQUE INDEX `IDX_0d933ba9421875f18a24b60abc` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_0d933ba9421875f18a24b60abc` ON `courier`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_191d47572c6e09c1598ea39a64` ON `courier`'
    );
    await queryRunner.query('DROP TABLE `courier`');
  }
}
