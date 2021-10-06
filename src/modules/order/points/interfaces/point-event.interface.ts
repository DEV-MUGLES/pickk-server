import { IBaseId } from '@common/interfaces';

import { IUser } from '@user/users/interfaces';

import { PointSign } from '../constants';

export interface IPointEvent extends IBaseId {
  title: string;
  sign: PointSign;
  amount: number;
  /** 적립/차감 이후 잔고 */
  resultBalance: number;

  /** 검색을 위한 field로 join하지 않는다. */
  orderItemMerchantUid?: string;

  user: IUser;
  userId: number;
}
