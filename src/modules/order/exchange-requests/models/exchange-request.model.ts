import { Field, ObjectType } from '@nestjs/graphql';
import { OrderItem } from '@order/order-items/models';

import { ExchangeRequestEntity } from '../entities';

@ObjectType()
export class ExchangeRequest extends ExchangeRequestEntity {
  @Field(() => OrderItem)
  orderItem: OrderItem;
}
