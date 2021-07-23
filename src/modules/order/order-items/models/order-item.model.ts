import { Field, ObjectType } from '@nestjs/graphql';

import { Order } from '@order/orders/models';

import { OrderItemEntity } from '../entities/order-item.entity';

@ObjectType()
export class OrderItem extends OrderItemEntity {
  @Field({
    description:
      'ApolloClient 최적화를 위한 필드입니다. DB에는 존재하지 않습니다.',
  })
  get id(): string {
    return this.merchantUid;
  }

  @Field({ name: 'Order' })
  order: Order;
}
