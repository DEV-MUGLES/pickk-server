import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

import { Order } from '../models';

@InputType()
export class CancelOrderInput extends PickType(
  Order,
  ['merchantUid'],
  InputType
) {
  @Field({ description: '취소 사유' })
  @IsString()
  reason: string;

  @Field(() => Int, {
    description:
      '취소로 인해 환불되어야할 액수를 프론트에서 계산해서 넘겨주세요.\n서버에서 계산한 값과 입력된 값이 같은지 검증합니다.',
  })
  @IsNumber()
  amount: number;

  @Field(() => Int, {
    description:
      '취소 후 남을 총 결제 금액을 프론트에서 계산해서 넘겨주세요.\n서버에서 계산한 값과 입력된 값이 같은지 검증합니다.',
  })
  @IsNumber()
  checksum: number;

  @Field(() => [String])
  @IsString({ each: true })
  orderItemMerchantUids: string[];
}
