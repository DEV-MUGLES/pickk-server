import { Field, ObjectType } from '@nestjs/graphql';

import { OrderItem } from '@order/order-items/models';
import { Order } from '@order/orders/models';

import { RefundRequestEntity } from '../entities';

@ObjectType()
export class RefundRequest extends RefundRequestEntity {
  @Field(() => Order)
  order: Order;

  @Field(() => [OrderItem])
  orderItems: OrderItem[];
}
