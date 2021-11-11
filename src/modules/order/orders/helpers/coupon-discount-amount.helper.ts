import { Coupon } from '@order/coupons/models';
import { OrderItem } from '@order/order-items/models';

import { findModelByUid } from '@common/helpers';

import { StartOrderItemInput } from '../dtos';

export const calTotalCouponDiscountAmount = (
  coupons: Coupon[],
  orderItems: OrderItem[],
  orderItemInputs: StartOrderItemInput[]
) =>
  coupons.reduce((totalDiscountAmount, coupon) => {
    const couponItem = findCouponItem(coupon.id, orderItems, orderItemInputs);
    if (!couponItem) {
      return totalDiscountAmount;
    }
    return totalDiscountAmount + coupon.getDiscountAmountFor(couponItem);
  }, 0);

export const findCouponItem = (
  couponId: number,
  orderItems: OrderItem[],
  orderItemInputs: StartOrderItemInput[]
) => {
  const orderItemInput = orderItemInputs.find(
    ({ usedCouponId }) => usedCouponId === couponId
  );
  if (!orderItemInput) {
    return null;
  }
  return findModelByUid(orderItemInput.merchantUid, orderItems).item;
};
