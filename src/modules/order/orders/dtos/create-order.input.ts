import { Field, InputType, Int } from '@nestjs/graphql';

import { ContentType } from '@common/constants';

@InputType()
export class CreateOrderItemInput {
  @Field(() => Int)
  productId: number;

  @Field(() => ContentType, { nullable: true })
  recommendContentType?: ContentType;

  @Field(() => Int, { nullable: true })
  recommendContentItemId?: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => [CreateOrderItemInput])
  orderItemInputs: CreateOrderItemInput[];
}
