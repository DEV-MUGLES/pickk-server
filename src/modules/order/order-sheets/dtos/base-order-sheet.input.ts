import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class BaseOrderSheetProductInput {
  @Field(() => Int)
  @IsNumber()
  productId: number;

  @Field(() => Int)
  @IsNumber()
  quantity: number;
}

@InputType()
export class BaseOrderSheetInput {
  @Field(() => [BaseOrderSheetProductInput])
  productInputs: BaseOrderSheetProductInput[];
}
