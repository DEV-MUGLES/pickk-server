import { ObjectType } from '@nestjs/graphql';

import { OrderRefundAccountEntity } from '../entities';

@ObjectType({
  description: '가상계좌 결제시 환불 받을 계좌 정보',
})
export class OrderRefundAccount extends OrderRefundAccountEntity {}
