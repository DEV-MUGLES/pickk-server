import * as faker from 'faker';

import { OrderCreator, StartOrderInputCreator } from '@order/orders/creators';
import { ShipmentOwnerType } from '@order/shipments/constants';
import { PayMethod } from '@payment/payments/constants';
import { ShippingAddress } from '@user/users/models';

import { OrderItemStatus } from '../constants';
import { ShipOrderItemInput } from '../dtos';

describe('OrderItem model', () => {
  const setUp = () => {
    const order = OrderCreator.create();
    const cardStartInput = StartOrderInputCreator.create(order, PayMethod.Card);
    const vbankStartInput = StartOrderInputCreator.create(
      order,
      PayMethod.Vbank
    );
    const shipInput: ShipOrderItemInput = {
      courierId: faker.datatype.number(),
      trackCode: faker.phone.phoneNumber('###########'),
    };

    return {
      order,
      cardStartInput,
      vbankStartInput,
      shipInput,
    };
  };

  describe('markShipReady', () => {
    it('성공적으로 수행한다.', () => {
      const { order, cardStartInput: cardStartInput } = setUp();

      order.start(cardStartInput, new ShippingAddress(), []);
      order.complete();
      order.orderItems[0].markShipReady();

      expect(order.orderItems[0].status).toEqual(OrderItemStatus.ShipReady);
    });
  });

  describe('ship', () => {
    it('성공적으로 수행한다.', () => {
      const { order, cardStartInput: cardStartInput, shipInput } = setUp();

      order.start(cardStartInput, new ShippingAddress(), []);
      order.complete();
      order.orderItems[0].markShipReady();
      order.orderItems[0].ship(shipInput);

      expect(order.orderItems[0].status).toEqual(OrderItemStatus.Shipping);
      expect(order.orderItems[0].shipment).toMatchObject(shipInput);
      expect(order.orderItems[0].shipment.ownerPk).toEqual(
        order.orderItems[0].merchantUid
      );
      expect(order.orderItems[0].shipment.ownerType).toEqual(
        ShipmentOwnerType.OrderItem
      );
    });
  });
});
