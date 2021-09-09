import { Type } from 'class-transformer';

import { Order } from '@order/orders/models';

export class SendOrderCompletedAlimtalkMto {
  @Type(() => Order)
  order: Order;
}
