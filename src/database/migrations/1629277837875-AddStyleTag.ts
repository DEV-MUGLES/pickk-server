import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStyleTag1629277837875 implements MigrationInterface {
  name = 'AddStyleTag1629277837875';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `style_tag` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(30) NOT NULL, `order` tinyint UNSIGNED NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `style_tag`');
  }
}
