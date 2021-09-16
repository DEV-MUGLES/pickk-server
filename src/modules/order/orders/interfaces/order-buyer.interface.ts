import { IBaseId } from '@common/interfaces';

import { IOrder } from './order.interface';

export interface IOrderBuyer extends IBaseId {
  order: IOrder;

  name: string;
  email: string;
  phoneNumber: string;
}
