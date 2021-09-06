import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateIndiceInLike1630649457160 implements MigrationInterface {
  name = 'UpdateIndiceInLike1630649457160';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `idx_ownerId-id` ON `like`');
    await queryRunner.query(
      'CREATE INDEX `idx_ownerId-userId` ON `like` (`ownerId`, `userId`)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `idx_ownerId-userId` ON `like`');
    await queryRunner.query(
      'CREATE INDEX `idx_ownerId-id` ON `like` (`ownerId`, `id`)'
    );
  }
}
