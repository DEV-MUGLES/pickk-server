import { InternalServerErrorException } from '@nestjs/common';

import { OrderStatus } from '../constants';
import { Order } from '../models';
import {
  OrderProcessStrategy,
  OrderFailedStrategy,
  OrderPayingStrategy,
  OrderVbankReadyStrategy,
  OrderVbankDodgedStrategy,
  OrderPaidStrategy,
} from '../strategies';

const { Failed, Paying, VbankReady, VbankDodged, Paid } = OrderStatus;

export class OrderProcessStrategyFactory {
  static from(status: OrderStatus, order: Order): OrderProcessStrategy {
    switch (status) {
      case Failed:
        return new OrderFailedStrategy(order);
      case Paying:
        return new OrderPayingStrategy(order);
      case VbankReady:
        return new OrderVbankReadyStrategy(order);
      case VbankDodged:
        return new OrderVbankDodgedStrategy(order);
      case Paid:
        return new OrderPaidStrategy(order);

      default:
        throw new InternalServerErrorException('Invalide OrderStatus to mark');
    }
  }
}
