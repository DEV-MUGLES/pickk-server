import { CouponCreator } from '@order/coupons/creators';
import { Coupon } from '@order/coupons/models';
import { OrderItem } from '@order/order-items/models';
import { PayMethod } from '@payment/payments/constants';

import { getRandomIntBetween } from '@common/helpers';

import { OrderCreator, StartOrderInputCreator } from '../creators';
import { StartOrderItemInput } from '../dtos';

import {
  calTotalCouponDiscountAmount,
  findCouponItem,
} from './coupon-discount-amount.helper';

describe('coupon discount amount helper', () => {
  const setUp = () => {
    const order = OrderCreator.create();
    const coupons = Array.from(
      new Array(getRandomIntBetween(1, order.orderItems.length)),
      (_, i) => CouponCreator.create(i)
    );
    const startInput = StartOrderInputCreator.create(
      order,
      PayMethod.Card,
      coupons
    );

    return {
      orderItems: order.orderItems,
      orderItemInputs: startInput.orderItemInputs,
      coupons,
    };
  };

  describe('calTotalCouponDiscountAmount', () => {
    let coupons: Coupon[];
    let orderItemInputs: StartOrderItemInput[];
    let orderItems: OrderItem[];

    beforeAll(() => {
      const {
        orderItems: _orderItems,
        coupons: _coupons,
        orderItemInputs: _orderItemInputs,
      } = setUp();
      coupons = _coupons;
      orderItemInputs = _orderItemInputs;
      orderItems = _orderItems;
    });

    it('성공적으로 총합을 계산한다.', () => {
      const discountAmount = getRandomIntBetween(1000, 3000);
      coupons.forEach(
        (coupon) =>
          (coupon.getDiscountAmountFor = jest.fn(() => discountAmount))
      );

      expect(
        calTotalCouponDiscountAmount(coupons, orderItems, orderItemInputs)
      ).toBe(discountAmount * coupons.length);
    });

    it('coupon이 없는 경우에는 0을 반환한다', () => {
      expect(
        calTotalCouponDiscountAmount([], orderItems, orderItemInputs)
      ).toBe(0);
    });
  });

  describe('findCouponItem', () => {
    let coupon: Coupon;
    let orderItems: OrderItem[];

    beforeAll(() => {
      const { orderItems: _orderItems } = setUp();
      orderItems = _orderItems;
      coupon = CouponCreator.create(1);
    });

    it('성공적으로 item을 반환한다', () => {
      const couponOrderItemIndex = 0;
      const orderItemInputs = [
        {
          merchantUid: orderItems[couponOrderItemIndex].merchantUid,
          usedCouponId: coupon.id,
        },
      ];
      expect(findCouponItem(coupon.id, orderItems, orderItemInputs)).toBe(
        orderItems[couponOrderItemIndex].item
      );
    });

    it('orderItemInputs에 입력받은 쿠폰이 없다면, null을 반환합니다.', () => {
      const orderItemInputs = [
        {
          merchantUid: orderItems[0].merchantUid,
          usedCouponId: -1,
        },
      ];

      expect(findCouponItem(coupon.id, orderItems, orderItemInputs)).toBeNull();
    });
  });
});
