import { Field, InputType, Int } from '@nestjs/graphql';

import { IProduct } from '../interfaces';

@InputType()
export class ProductFilter implements Partial<IProduct> {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  stock?: number;

  @Field(() => [Int], { nullable: true })
  idIn?: number[];
}
