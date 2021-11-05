import { IBaseId } from '@common/interfaces';

import { IStyleTag } from '@content/style-tags/interfaces';

import { UserOauthProvider, UserRole } from '../constants';

import { IShippingAddress } from './shipping-address.interface';
import { IRefundAccount } from './refund-account.interface';

/**
 * User variable type declaration.
 *
 * @interface
 */
export interface IUser extends IBaseId {
  role?: UserRole;
  oauthProvider?: UserOauthProvider;
  oauthCode?: string;

  code?: string;
  email: string;
  phoneNumber?: string;
  nickname: string;
  description: string;
  _avatarUrl: string;

  naverCode: string;
  instagramCode: string;
  youtubeUrl: string;
  mainChannel: string;

  isCeleb: boolean;

  /** 개인정보 */
  name?: string | null;
  weight?: number;
  height?: number;

  styleTags: IStyleTag[];
  shippingAddresses: IShippingAddress[];
  refundAccount: IRefundAccount;

  // 계산되는 field들
  followCount: number;

  // model-only field들
  isFollowing: boolean;
  isMe: boolean;
}
