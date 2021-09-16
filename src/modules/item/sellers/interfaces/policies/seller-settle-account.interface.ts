import { IAccount } from '@common/interfaces';

import { ISellerClaimPolicy } from './seller-claim-policy.interface';

export interface ISellerSettleAccount extends IAccount {
  claimPolicy: ISellerClaimPolicy;
  claimPolicyId: number;
}
