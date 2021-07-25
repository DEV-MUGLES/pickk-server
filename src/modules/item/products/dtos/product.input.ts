import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

import { Product } from '../models';

@InputType()
export class UpdateProductInput extends PickType(
  Product,
  ['stock'],
  InputType
) {}

@InputType()
export class DestockProductInput {
  @Field(() => Int)
  @IsNumber()
  quantity: number;

  @Field(() => Int)
  @IsNumber()
  productId: number;

  @Field(() => Product, { nullable: true })
  @IsOptional()
  product?: Product;
}
