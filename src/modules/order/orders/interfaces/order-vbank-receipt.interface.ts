import { IAccount } from '@common/interfaces';

export interface IOrderVbankReceipt extends IAccount {
  /** 입금기한 (timestamp) */
  due: Date;
}
