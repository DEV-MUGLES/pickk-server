import { InternalServerErrorException } from '@nestjs/common';

import { OrderItemClaimStatus, OrderItemStatus } from '../constants';
import { OrderItem } from '../models';
import {
  OrderItemProcessStrategy,
  OrderItemFailedStrategy,
  OrderItemVbankReadyStrategy,
  OrderItemVbankDodgedStrategy,
  OrderItemPaidStrategy,
  OrderItemShipReadyStrategy,
  OrderItemShippingStrategy,
  OrderItemCancelledStrategy,
  OrderItemExchangeRequestedStrategy,
  OrderItemRefundRequestedStrategy,
} from '../strategies';

const { Failed, VbankReady, VbankDodged, Paid, ShipReady, Shipping } =
  OrderItemStatus;
const { Cancelled, RefundRequested, ExchangeRequested } = OrderItemClaimStatus;

export class OrderItemProcessStrategyFactory {
  static from(
    status: OrderItemStatus | OrderItemClaimStatus,
    orderItem: OrderItem
  ): OrderItemProcessStrategy {
    switch (status) {
      case Failed:
        return new OrderItemFailedStrategy(orderItem);
      case VbankReady:
        return new OrderItemVbankReadyStrategy(orderItem);
      case VbankDodged:
        return new OrderItemVbankDodgedStrategy(orderItem);
      case Paid:
        return new OrderItemPaidStrategy(orderItem);

      case ShipReady:
        return new OrderItemShipReadyStrategy(orderItem);
      case Shipping:
        return new OrderItemShippingStrategy(orderItem);

      case Cancelled:
        return new OrderItemCancelledStrategy(orderItem);
      case ExchangeRequested:
        return new OrderItemExchangeRequestedStrategy(orderItem);
      case RefundRequested:
        return new OrderItemRefundRequestedStrategy(orderItem);

      default:
        throw new InternalServerErrorException(
          'Invalide OrderItemStatus to mark'
        );
    }
  }
}
