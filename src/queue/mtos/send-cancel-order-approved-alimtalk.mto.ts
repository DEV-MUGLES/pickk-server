import { Order } from '@order/orders/models';
import { Type } from 'class-transformer';

export class SendCancelOrderApprovedAlimtalkMto {
  @Type(() => Order)
  canceledOrder: Order;
}
