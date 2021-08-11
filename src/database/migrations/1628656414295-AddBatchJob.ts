import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBatchJob1628656414295 implements MigrationInterface {
  name = 'AddBatchJob1628656414295';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `job_execution_context_record` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `shortContext` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `job` (`name` varchar(50) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`name`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `step_execution_record` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `stepName` varchar(50) NOT NULL, `status` enum ('STARTED', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'STARTED', `errorMessage` varchar(100) NULL, `jobExecutionRecordId` int NULL, `startedAt` datetime NULL, `endAt` datetime NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `job_execution_record` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `status` enum ('STARTED', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'STARTED', `errorMessage` varchar(100) NULL, `jobName` varchar(50) NULL, `contextRecordId` int NULL, `startedAt` datetime NULL, `endAt` datetime NULL, UNIQUE INDEX `REL_db11fb436072f887093856e50e` (`contextRecordId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'ALTER TABLE `step_execution_record` ADD CONSTRAINT `FK_33461255f33fcb440f4fb84f840` FOREIGN KEY (`jobExecutionRecordId`) REFERENCES `job_execution_record`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `job_execution_record` ADD CONSTRAINT `FK_5d7111cc1ad19e5dfff60c710c5` FOREIGN KEY (`jobName`) REFERENCES `job`(`name`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `job_execution_record` ADD CONSTRAINT `FK_db11fb436072f887093856e50e3` FOREIGN KEY (`contextRecordId`) REFERENCES `job_execution_context_record`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `job_execution_record` DROP FOREIGN KEY `FK_db11fb436072f887093856e50e3`'
    );
    await queryRunner.query(
      'ALTER TABLE `job_execution_record` DROP FOREIGN KEY `FK_5d7111cc1ad19e5dfff60c710c5`'
    );
    await queryRunner.query(
      'ALTER TABLE `step_execution_record` DROP FOREIGN KEY `FK_33461255f33fcb440f4fb84f840`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_db11fb436072f887093856e50e` ON `job_execution_record`'
    );
    await queryRunner.query('DROP TABLE `job_execution_record`');
    await queryRunner.query('DROP TABLE `step_execution_record`');
    await queryRunner.query('DROP TABLE `job`');
    await queryRunner.query('DROP TABLE `job_execution_context_record`');
  }
}
