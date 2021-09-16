import { ObjectType, Field, Int } from '@nestjs/graphql';

import { OrderItem } from '@order/order-items/models';

@ObjectType()
export class OrderBrand {
  @Field(() => Int)
  id: number;

  @Field()
  nameKor: string;
  @Field()
  imageUrl: string;

  @Field(() => Int)
  shippingFee: number;
  @Field(() => Int)
  totalItemFinalPrice: number;

  @Field(() => [OrderItem])
  items: OrderItem[];

  constructor(attributes?: Partial<OrderBrand>) {
    Object.assign(this, attributes);
  }
}
