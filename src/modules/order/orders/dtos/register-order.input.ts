import { Field, InputType, Int } from '@nestjs/graphql';

import { ContentType } from '@common/constants';

@InputType()
export class RegisterOrderItemInput {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => ContentType, { nullable: true })
  recommendContentType?: ContentType;

  @Field(() => Int, { nullable: true })
  recommendContentItemId?: number;
}

@InputType()
export class RegisterOrderInput {
  @Field(() => [Int], { nullable: true })
  cartItemIds: number[];

  @Field(() => [RegisterOrderItemInput], { nullable: true })
  orderItemInputs: RegisterOrderItemInput[];
}
