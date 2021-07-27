import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPayment1627291402016 implements MigrationInterface {
  name = 'AddPayment1627291402016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `payment_cancellation` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `type` enum ('cancel', 'partial_cancel') NOT NULL, `amount` int UNSIGNED NOT NULL, `reason` varchar(30) NOT NULL, `taxFree` int UNSIGNED NOT NULL DEFAULT '0', `refundVbankCode` enum ('02', '03', '04', '05', '06', '07', '11', '12', '16', '20', '21', '22', '23', '24', '25', '26', '27', '31', '32', '34', '35', '37', '38', '39', '41', '48', '50', '53', '54', '55', '56', '57', '59', '60', '64', '70', '71', '81', '83', '87', '88', '89', '90', '91', '93', '94', '96', '97', '98') NULL, `refundVbankNum` varchar(255) NULL, `refundVbankHolder` varchar(15) NULL, `paymentMerchantUid` char(20) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `payment` (`merchantUid` char(20) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `status` enum ('pending', 'vbank_ready', 'paid', 'cancelled', 'partial_cancelled', 'failed') NOT NULL, `env` enum ('pc', 'mobile') NOT NULL, `origin` varchar(255) NOT NULL, `pg` enum ('inicis') NOT NULL, `pgTid` varchar(255) NULL, `payMethod` enum ('card', 'trans', 'vbank', 'phone', 'samsungpay', 'kpay', 'kakaopay', 'payco', 'lpay', 'ssgpay', 'tosspay', 'cultureland', 'smartculture', 'happymoney', 'booknlife', 'point', 'naverpay', 'chaipay') NOT NULL, `name` varchar(255) NOT NULL, `amount` int UNSIGNED NOT NULL, `buyerName` varchar(20) NOT NULL, `buyerTel` char(11) NOT NULL, `buyerEmail` varchar(255) NOT NULL, `buyerPostalcode` char(6) NOT NULL, `buyerAddr` varchar(255) NOT NULL, `applyNum` varchar(255) NULL, `cardCode` enum ('01', '03', '04', '06', '11', '12', '14', '15', '16', '17', '21', '22', '23', '24', '25', '91', '93', '94', '96', '97', '98') NULL, `cardNum` varchar(255) NULL, `vbankCode` enum ('02', '03', '04', '05', '06', '07', '11', '12', '16', '20', '21', '22', '23', '24', '25', '26', '27', '31', '32', '34', '35', '37', '38', '39', '41', '48', '50', '53', '54', '55', '56', '57', '59', '60', '64', '70', '71', '81', '83', '87', '88', '89', '90', '91', '93', '94', '96', '97', '98') NULL, `vbankNum` varchar(255) NULL, `vbankHolder` varchar(15) NULL, `vbankDate` timestamp NULL, `failedReason` varchar(255) NULL, `failedAt` timestamp NULL, `paidAt` timestamp NULL, `cancelledAt` timestamp NULL, INDEX `id_pg-tid` (`pgTid`), PRIMARY KEY (`merchantUid`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'ALTER TABLE `payment_cancellation` ADD CONSTRAINT `FK_431ae61d7ba0e61a1ce043b9fe1` FOREIGN KEY (`paymentMerchantUid`) REFERENCES `payment`(`merchantUid`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `payment_cancellation` DROP FOREIGN KEY `FK_431ae61d7ba0e61a1ce043b9fe1`'
    );
    await queryRunner.query('DROP INDEX `id_pg-tid` ON `payment`');
    await queryRunner.query('DROP TABLE `payment`');
    await queryRunner.query('DROP TABLE `payment_cancellation`');
  }
}
