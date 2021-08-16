import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CancelOrderInput {
  @Field({ description: '취소 사유' })
  @IsString()
  reason: string;

  @Field(() => [String])
  @IsString({ each: true })
  orderItemMerchantUids: string[];
}
