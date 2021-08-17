import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVbankDodge2Payment1629172084213 implements MigrationInterface {
  name = 'AddVbankDodge2Payment1629172084213';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `payment` ADD `vbankDodgedAt` timestamp NULL'
    );

    await queryRunner.query(
      "ALTER TABLE `payment` CHANGE `status` `status` enum ('pending', 'vbank_ready', 'paid', 'cancelled', 'partial_cancelled', 'vbank_dodged', 'failed') NOT NULL"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // vbank_dodged를 제거하기 전에 모두 failed로 mapping 해준다.
    await queryRunner.query(
      "UPDATE `payment` SET status = 'failed' WHERE status = 'vbank_dodged'"
    );
    await queryRunner.query(
      "ALTER TABLE `payment` CHANGE `status` `status` enum ('pending', 'vbank_ready', 'paid', 'cancelled', 'partial_cancelled', 'failed') NOT NULL"
    );

    await queryRunner.query(
      'ALTER TABLE `payment` DROP COLUMN `vbankDodgedAt`'
    );
  }
}
