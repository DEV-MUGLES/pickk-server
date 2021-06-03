import { IUser } from '@src/modules/user/users/interfaces/user.interface';

import { CouponStatus } from '../constants/coupon.enum';
import { ICouponSpecification } from './coupon-specification.interface';

export interface ICoupon {
  userId: number;
  user: IUser;

  specId: number;
  spec: ICouponSpecification;

  status: CouponStatus;
}
