import { IAddress } from '@common/interfaces';

import { IOrder } from './order.interface';

export interface IOrderReceiver extends IAddress {
  order: IOrder;

  message: string;
}
