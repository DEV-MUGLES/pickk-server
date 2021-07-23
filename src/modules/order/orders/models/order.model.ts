import { Field, ObjectType } from '@nestjs/graphql';

import { OrderItem } from '@order/order-items/models';

import { OrderEntity } from '../entities';

@ObjectType()
export class Order extends OrderEntity {
  @Field({
    description:
      'ApolloClient 최적화를 위한 필드입니다. DB에는 존재하지 않습니다.',
  })
  get id(): string {
    return this.merchantUid;
  }

  @Field(() => [OrderItem])
  orderItems: OrderItem[];
}
