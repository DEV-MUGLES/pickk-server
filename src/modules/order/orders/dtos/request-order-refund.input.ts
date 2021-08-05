import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

import { RefundRequest } from '@order/refund-requests/models';

@InputType()
export class RequestOrderRefundInput extends PickType(
  RefundRequest,
  ['reason', 'amount', 'faultOf'],
  InputType
) {
  @Field(() => Int, {
    description:
      '반품로 인해 환불되어야할 액수를 프론트에서 계산해서 넘겨주세요.\n서버에서 계산한 값과 입력된 값이 같은지 검증합니다.',
  })
  amount: number;

  @Field(() => Int, {
    description:
      '반품 후 남을 총 결제 금액을 프론트에서 계산해서 넘겨주세요.\n서버에서 계산한 값과 입력된 값이 같은지 검증합니다.',
  })
  @IsNumber()
  checksum: number;

  @Field(() => [String], {
    description:
      '반품처리할 OrderItem들. 같은 브랜드의 OrderItem들로만 신청할 수 있습니다.',
  })
  @IsString({ each: true })
  orderItemMerchantUids: string[];
}
