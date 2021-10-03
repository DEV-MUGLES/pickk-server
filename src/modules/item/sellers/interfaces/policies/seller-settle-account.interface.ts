import { IAccount } from '@common/interfaces';

import { ISellerSettlePolicy } from './seller-settle-policy.interface';

export interface ISellerSettleAccount extends IAccount {
  settlePolicy: ISellerSettlePolicy;
  settlePolicyId: number;
}
