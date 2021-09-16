import { IAccount } from '@common/interfaces';

import { IUser } from './user.interface';

export interface IRefundAccount extends IAccount {
  user: IUser;
}
