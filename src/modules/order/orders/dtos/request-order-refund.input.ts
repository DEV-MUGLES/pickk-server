import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

import { RefundRequest } from '@order/refund-requests/models';
import { CreateShipmentInput } from '@order/shipments/dtos';

@InputType()
export class RequestOrderRefundInput extends PickType(
  RefundRequest,
  ['reason', 'faultOf'],
  InputType
) {
  @Field(() => [String], {
    description:
      '반품처리할 OrderItem들. 같은 브랜드의 OrderItem들로만 신청할 수 있습니다.',
  })
  @IsString({ each: true })
  orderItemMerchantUids: string[];

  @Field(() => CreateShipmentInput, { nullable: true })
  shipmentInput: CreateShipmentInput;
}
