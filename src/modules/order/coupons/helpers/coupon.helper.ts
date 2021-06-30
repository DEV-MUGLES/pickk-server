import dayjs from 'dayjs';

import { CouponStatus } from '../constants/coupon.enum';

export function checkExpireAt(expireAt: Date): boolean {
  return dayjs().isBefore(expireAt);
}

export function checkStatus(status: CouponStatus): boolean {
  return status === CouponStatus.Applied;
}

export function checkMinimumFotUse(
  minimumForUse: number,
  finalPrice: number
): boolean {
  return finalPrice <= minimumForUse;
}

export function checkBrand(brandId: number, itemBrandId: number): boolean {
  if (brandId === undefined) {
    return true;
  }
  return brandId === itemBrandId;
}
