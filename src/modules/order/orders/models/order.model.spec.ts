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
});
