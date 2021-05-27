import { ObjectType } from '@nestjs/graphql';

import { SellerClaimAccountEntity } from '../../entities/policies/seller-claim-account.entity';

@ObjectType({
  description: '교환배송비 지불 계좌',
})
export class SellerClaimAccount extends SellerClaimAccountEntity {}
