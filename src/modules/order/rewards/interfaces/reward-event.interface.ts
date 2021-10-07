import { IBaseId } from '@common/interfaces';

import { IDigest } from '@content/digests/interfaces';
import { IOrderItem } from '@order/order-items/interfaces';
import { IUser } from '@user/users/interfaces';

import { RewardSign } from '../constants';

export interface IRewardEvent extends IBaseId {
  user: IUser;
  userId: number;
  recommendDigest: IDigest;
  recommendDigestId: number;
  orderItem: IOrderItem;
  orderItemMerchantUid: string;

  sign: RewardSign;
  title: string;
  amount: number;
  /** 적립/차감 이후 잔고 */
  resultBalance: number;
}
