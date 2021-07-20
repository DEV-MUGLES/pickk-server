import { Field, ObjectType } from '@nestjs/graphql';

import { Order } from '@order/orders/models';

import { OrderItemEntity } from '../entities/order-item.entity';

@ObjectType()
export class OrderItem extends OrderItemEntity {
  @Field({ name: 'Order' })
  order: Order;
}
