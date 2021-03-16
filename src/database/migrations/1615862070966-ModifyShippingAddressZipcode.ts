import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyShippingAddressZipcode1615862070966
  implements MigrationInterface {
  name = 'ModifyShippingAddressZipcode1615862070966';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `shipping_address` CHANGE `zipCode` `postalCode` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `code` `code` varchar(255) NULL DEFAULT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `code` `code` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` CHANGE `postalCode` `zipCode` varchar(255) NOT NULL'
    );
  }
}
