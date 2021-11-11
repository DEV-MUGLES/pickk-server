import {
  OrderItemClaimStatus,
  OrderItemStatus,
} from '@order/order-items/constants';
import { PayMethod } from '@payment/payments/constants';
import { ShippingAddress } from '@user/users/models';

import { OrderStatus } from '../constants';
import {
  OrderCreator,
  RequestOrderRefundInputCreator,
  StartOrderInputCreator,
} from '../creators';

describe('Order model', () => {
  const setUp = () => {
    const order = OrderCreator.create();
    const cardStartInput = StartOrderInputCreator.create(order, PayMethod.Card);
    const vbankStartInput = StartOrderInputCreator.create(
      order,
      PayMethod.Vbank
    );

    return {
      order,
      cardStartInput,
      vbankStartInput,
    };
  };

  describe('start', () => {
    it('성공적으로 수행한다.', () => {
      const { order, cardStartInput } = setUp();
      order.start(cardStartInput, new ShippingAddress(), []);

      expect(order.payMethod).toEqual(cardStartInput.payMethod);
      expect(order.status).toEqual(OrderStatus.Paying);
      expect(order.totalUsedPointAmount).toEqual(
        cardStartInput.usedPointAmount
      );
    });
  });

  describe('markFailed', () => {
    it('성공적으로 수행한다.', () => {
      const { order, cardStartInput } = setUp();

      order.start(cardStartInput, new ShippingAddress(), []);
      order.markFailed();

      expect(order.status).toEqual(OrderStatus.Failed);
      order.orderItems.forEach((oi) => {
        expect(oi.status).toEqual(OrderItemStatus.Failed);
      });
    });
  });

  describe('complete', () => {
    it('성공적으로 수행한다.', () => {
      const { order, cardStartInput: cardStartInput } = setUp();

      order.start(cardStartInput, new ShippingAddress(), []);
      order.complete();

      expect(order.status).toEqual(OrderStatus.Paid);
      order.orderItems.forEach((oi) => {
        expect(oi.status).toEqual(OrderItemStatus.Paid);
      });
    });

    it('가상계좌도 성공적으로 수행한다.', () => {
      const { order, vbankStartInput } = setUp();

      order.start(vbankStartInput, new ShippingAddress(), []);
      order.complete({});

      expect(order.status).toEqual(OrderStatus.VbankReady);
      order.orderItems.forEach((oi) => {
        expect(oi.status).toEqual(OrderItemStatus.VbankReady);
      });
    });

    it('실패한 이후에도 성공적으로 수행한다.', () => {
      const { order, cardStartInput: cardStartInput } = setUp();

      order.start(cardStartInput, new ShippingAddress(), []);
      order.markFailed();
      order.start(cardStartInput, new ShippingAddress(), []);
      order.complete();

      expect(order.status).toEqual(OrderStatus.Paid);
      order.orderItems.forEach((oi) => {
        expect(oi.status).toEqual(OrderItemStatus.Paid);
      });
    });
  });

  describe('markVbankDodged', () => {
    it('성공적으로 수행한다.', () => {
      const { order, vbankStartInput } = setUp();

      order.start(vbankStartInput, new ShippingAddress(), []);
      order.complete({});
      order.markVbankDodged();

      expect(order.status).toEqual(OrderStatus.VbankDodged);
      order.orderItems.forEach((oi) => {
        expect(oi.status).toEqual(OrderItemStatus.VbankDodged);
      });
    });
  });

  describe('cancel', () => {
    it('성공적으로 수행한다.', () => {
      const { order, cardStartInput } = setUp();

      order.start(cardStartInput, new ShippingAddress(), []);
      order.complete();
      const result = order.cancel([order.orderItems[0].merchantUid]);

      expect(order.orderItems[0].claimStatus).toEqual(
        OrderItemClaimStatus.Cancelled
      );
      expect(order.totalPayAmount).toEqual(result.checksum);
    });

    it('포인트를 사용하지 않았을 때도 성공한다.', () => {
      const { order, cardStartInput } = setUp();
      cardStartInput.usedPointAmount = 0;

      order.start(cardStartInput, new ShippingAddress(), []);
      order.complete();
      const result = order.cancel([order.orderItems[0].merchantUid]);

      expect(order.orderItems[0].claimStatus).toEqual(
        OrderItemClaimStatus.Cancelled
      );
      expect(order.totalPayAmount).toEqual(result.checksum);
    });
  });

  describe('requestRefund', () => {
    it('성공적으로 수행한다.', () => {
      const { order, cardStartInput } = setUp();

      const requestRefundInput = RequestOrderRefundInputCreator.create(
        [order.orderItems[0].merchantUid],
        true
      );

      order.start(cardStartInput, new ShippingAddress(), []);
      order.complete();
      for (const oi of order.orderItems) {
        oi.markShipReady();
      }

      order.requestRefund(requestRefundInput);

      expect(order.orderItems[0].claimStatus).toEqual(
        OrderItemClaimStatus.RefundRequested
      );
      expect(order.refundRequests[0].amount).toEqual(
        order.orderItems[0].payAmount
      );
    });

    it('반품불가면 실패한다.', () => {
      const { order, cardStartInput } = setUp();

      const requestRefundInput = RequestOrderRefundInputCreator.create(
        [order.orderItems[0].merchantUid],
        true
      );

      order.orderItems[0].seller.claimPolicy.isRefundable = false;

      order.start(cardStartInput, new ShippingAddress(), []);
      order.complete();
      for (const oi of order.orderItems) {
        oi.markShipReady();
      }

      expect(() => order.requestRefund(requestRefundInput)).toThrowError();
    });
  });
});
