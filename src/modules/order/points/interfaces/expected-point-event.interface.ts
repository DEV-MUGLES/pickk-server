import { IBaseId } from '@common/interfaces';

import { IUser } from '@user/users/interfaces';

export interface IExpectedPointEvent extends IBaseId {
  amount: number;

  title: string;
  content: string;

  /** 검색을 위한 field로 join하지 않는다. */
  orderItemMerchantUid: string;

  user: IUser;
  userId: number;
}
