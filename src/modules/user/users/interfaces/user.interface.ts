import { IAccount } from '@common/interfaces/account.interface';

import { UserOauthProvider, UserRole } from '../constants/user.enum';
import { IShippingAddress } from './shipping-address.interface';

/**
 * User variable type declaration.
 *
 * @interface
 */
export interface IUser {
  role?: UserRole;
  oauthProvider?: UserOauthProvider;
  oauthCode?: string;

  code?: string;
  email: string;
  nickname: string;

  name?: string | null;
  weight?: number;
  height?: number;

  shippingAddresses: IShippingAddress[];
  refundAccount: IAccount;
}
