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
  _avatarUrl: string;

  instagramCode: string;
  youtubeUrl: string;

  /** 개인정보 */
  name?: string | null;
  weight?: number;
  height?: number;

  styleTags: IStyleTag[];
  shippingAddresses: IShippingAddress[];
  refundAccount: IAccount;

  // 계산되는 field들
  followCount: number;

  // model-only field들
  isFollowing: boolean;
  isMe: boolean;
}
