import { IAccount } from '@common/interfaces';
import { IStyleTag } from '@content/style-tags/interfaces';

import { UserOauthProvider, UserRole } from '../constants';

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
  phoneNumber?: string;
  nickname: string;

  name?: string | null;
  weight?: number;
  height?: number;

  styleTags: IStyleTag[];
  shippingAddresses: IShippingAddress[];
  refundAccount: IAccount;
}
