import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { OrderItem } from '@order/order-items/models';

@ObjectType()
export class SearchOrderItemsOutput {
  @Field(() => Int)
  total: number;

  @Field(() => [OrderItem])
  @Type(() => OrderItem)
  result: OrderItem[];
}
