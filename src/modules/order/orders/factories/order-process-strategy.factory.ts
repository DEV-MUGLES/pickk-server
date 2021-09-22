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

const { FAILED, PAYING, VBANK_READY, VBANK_DODGED, PAID } = OrderStatus;

export class OrderProcessStrategyFactory {
  static from(status: OrderStatus, order: Order): OrderProcessStrategy {
    switch (status) {
      case FAILED:
        return new OrderFailedStrategy(order);
      case PAYING:
        return new OrderPayingStrategy(order);
      case VBANK_READY:
        return new OrderVbankReadyStrategy(order);
      case VBANK_DODGED:
        return new OrderVbankDodgedStrategy(order);
      case PAID:
        return new OrderPaidStrategy(order);

      default:
        throw new InternalServerErrorException('Invalide OrderStatus to mark');
    }
  }
}
