import { IBaseId } from '@common/interfaces';

import { IUser } from '@user/users/interfaces';

import { CouponStatus } from '../constants';

import { ICouponSpecification } from './coupon-specification.interface';

export interface ICoupon extends IBaseId {
  userId: number;
  user: IUser;

  specId: number;
  spec: ICouponSpecification;

  status: CouponStatus;
}
