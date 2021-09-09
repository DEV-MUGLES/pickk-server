import { Type } from 'class-transformer';

import { Order } from '@order/orders/models';

export class SendVbankNotiAlimtalkMto {
  @Type(() => Order)
  order: Order;
}
