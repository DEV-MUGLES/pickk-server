import { Field, ObjectType } from '@nestjs/graphql';

import { OrderItem } from '@order/order-items/models';

import { OrderEntity } from '../entities';

@ObjectType()
export class Order extends OrderEntity {
  @Field(() => [OrderItem])
  orderItems: OrderItem[];
}
