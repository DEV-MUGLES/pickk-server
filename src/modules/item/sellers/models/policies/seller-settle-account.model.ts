import { ObjectType } from '@nestjs/graphql';

import { SellerSettleAccountEntity } from '../../entities/policies';

@ObjectType({
  description: '정산 계좌',
})
export class SellerSettleAccount extends SellerSettleAccountEntity {}
