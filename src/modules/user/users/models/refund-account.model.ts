import { ObjectType } from '@nestjs/graphql';

import { RefundAccountEntity } from '../entities/refund-account.entity';

@ObjectType({
  description: '가상계좌 결제시 환불 받을 계좌 정보',
})
export class RefundAccount extends RefundAccountEntity {}
