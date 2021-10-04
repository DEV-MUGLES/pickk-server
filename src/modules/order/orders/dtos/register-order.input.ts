import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RegisterOrderItemInput {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Int, { nullable: true })
  recommendDigestId: number;
}

@InputType()
export class RegisterOrderInput {
  @Field(() => [Int], { nullable: true })
  cartItemIds: number[];

  @Field(() => [RegisterOrderItemInput], { nullable: true })
  orderItemInputs: RegisterOrderItemInput[];
}
