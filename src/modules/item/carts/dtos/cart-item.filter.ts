import { Field, InputType, Int } from '@nestjs/graphql';

import { ICartItem } from '../interfaces';

@InputType()
export class CartItemFilter implements Partial<ICartItem> {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => [Int], { nullable: true })
  idIn?: number[];
}
