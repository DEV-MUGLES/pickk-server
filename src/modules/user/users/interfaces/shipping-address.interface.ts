import { IAddress } from '@common/interfaces';

import { IUser } from './user.interface';

export interface IShippingAddress extends IAddress {
  isPrimary: boolean;

  user: IUser;
  userId: number;
}
