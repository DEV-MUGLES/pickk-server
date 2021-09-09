import { Type } from 'class-transformer';

import { Order } from '@order/orders/models';

export class SendCancelOrderApprovedAlimtalkMto {
  @Type(() => Order)
  canceledOrder: Order;
}
