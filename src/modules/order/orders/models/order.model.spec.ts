import {
  OrderItemClaimStatus,
  OrderItemStatus,
} from '@order/order-items/constants';
import { PayMethod } from '@payment/payments/constants';
import { ShippingAddress } from '@user/users/models';

import { OrderStatus } from '../constants';
import { OrderCreator, StartOrderInputCreator } from '../creators';

describe('Order model', () => {
  describe('start', () => {
    it('성공적으로 수행한다.', () => {
      const order = OrderCreator.create();
      const input = StartOrderInputCreator.create(order);

      order.start(input, new ShippingAddress(), []);

      expect(order.payMethod).toEqual(input.payMethod);
      expect(order.status).toEqual(OrderStatus.Paying);
      expect(order.totalUsedPointAmount).toEqual(input.usedPointAmount);
    });
  });

  describe('complete', () => {
    it('성공적으로 수행한다.', () => {
      const order = OrderCreator.create();
      const input = StartOrderInputCreator.create(order);
      if (input.payMethod === PayMethod.Vbank) {
        input.payMethod = PayMethod.Card;
      }

      order.start(input, new ShippingAddress(), []);
      order.complete();

      expect(order.status).toEqual(OrderStatus.Paid);
    });

    it('가상계좌도 성공적으로 수행한다.', () => {
      const order = OrderCreator.create();
      const input = StartOrderInputCreator.create(order, PayMethod.Vbank);

      order.start(input, new ShippingAddress(), []);
      order.complete({});

      expect(order.status).toEqual(OrderStatus.VbankReady);
    });

    it('실패한 이후에도 성공적으로 수행한다.', () => {
      const order = OrderCreator.create();
      const input = StartOrderInputCreator.create(order);
      if (input.payMethod === PayMethod.Vbank) {
        input.payMethod = PayMethod.Card;
      }

      order.start(input, new ShippingAddress(), []);
      order.markFailed();
      order.start(input, new ShippingAddress(), []);
      order.complete();

      expect(order.status).toEqual(OrderStatus.Paid);
    });
  });
});
