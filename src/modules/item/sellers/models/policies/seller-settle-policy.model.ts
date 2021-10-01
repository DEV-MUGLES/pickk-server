import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { SellerSettlePolicyEntity } from '../../entities/policies';
import { SellerSettleAccount } from './seller-settle-account.model';

@ObjectType()
export class SellerSettlePolicy extends SellerSettlePolicyEntity {
  @Field(() => SellerSettleAccount, { description: '정산 받을 계좌' })
  @Type(() => SellerSettleAccount)
  account: SellerSettleAccount;
}
