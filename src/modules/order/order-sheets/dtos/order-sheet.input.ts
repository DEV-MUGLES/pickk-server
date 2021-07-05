import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class PrepareOrderSheetProductInput {
  @Field(() => Int)
  @IsNumber()
  productId: number;

  @Field(() => Int)
  @IsNumber()
  quantity: number;
}

@InputType()
export class PrepareOrderSheetInput {
  @Field(() => [PrepareOrderSheetProductInput])
  productInputs: PrepareOrderSheetProductInput[];
}
