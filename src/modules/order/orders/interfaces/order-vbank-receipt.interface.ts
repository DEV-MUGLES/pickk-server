import { IAccount } from '@common/interfaces';

import { IOrder } from './order.interface';

export interface IOrderVbankReceipt extends IAccount {
  order: IOrder;

  /** 입금기한 (timestamp) */
  due: Date;
}
