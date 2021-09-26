import {
  OrderItemClaimStatus,
  OrderItemStatus,
} from '@order/order-items/constants';
import { PayMethod } from '@payment/payments/constants';
import { ShippingAddress } from '@user/users/models';

import { OrderStatus } from '../constants';
import { OrderCreator, StartOrderInputCreator } from '../creators';

describe('Order model', () => {
  const setUp = () => {
    const order = OrderCreator.create();
    const startInput = StartOrderInputCreator.create(order);
    const vbankStartInput = StartOrderInputCreator.create(
      order,
      PayMethod.Vbank
    );

    return {
      order,
      startInput,
      vbankStartInput,
    };
  };

  describe('start', () => {
    it('성공적으로 수행한다.', () => {
      const { order, startInput } = setUp();

      order.start(startInput, new ShippingAddress(), []);

      expect(order.payMethod).toEqual(startInput.payMethod);
      expect(order.status).toEqual(OrderStatus.Paying);
      expect(order.totalUsedPointAmount).toEqual(startInput.usedPointAmount);
    });
  });

  describe('markFailed', () => {
    it('성공적으로 수행한다.', () => {
      const { order, startInput } = setUp();

      order.start(startInput, new ShippingAddress(), []);
      order.markFailed();

      expect(order.status).toEqual(OrderStatus.Failed);
      order.orderItems.forEach((oi) => {
        expect(oi.status).toEqual(OrderItemStatus.Failed);
      });
    });
  });

  describe('complete', () => {
    it('성공적으로 수행한다.', () => {
      const { order, startInput } = setUp();
      if (startInput.payMethod === PayMethod.Vbank) {
        startInput.payMethod = PayMethod.Card;
      }

      order.start(startInput, new ShippingAddress(), []);
      order.complete();

      expect(order.status).toEqual(OrderStatus.Paid);
    });

    it('가상계좌도 성공적으로 수행한다.', () => {
      const { order, vbankStartInput } = setUp();

      order.start(vbankStartInput, new ShippingAddress(), []);
      order.complete({});

      expect(order.status).toEqual(OrderStatus.VbankReady);
    });

    it('실패한 이후에도 성공적으로 수행한다.', () => {
      const { order, startInput } = setUp();
      if (startInput.payMethod === PayMethod.Vbank) {
        startInput.payMethod = PayMethod.Card;
      }

      order.start(startInput, new ShippingAddress(), []);
      order.markFailed();
      order.start(startInput, new ShippingAddress(), []);
      order.complete();

      expect(order.status).toEqual(OrderStatus.Paid);
    });
  });
});
