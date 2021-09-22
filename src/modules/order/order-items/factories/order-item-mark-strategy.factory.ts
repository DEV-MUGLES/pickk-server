import { InternalServerErrorException } from '@nestjs/common';

import { OrderItemClaimStatus, OrderItemStatus } from '../constants';
import { OrderItem } from '../models';
import {
  OrderItemMarkStrategy,
  OrderItemFailedStrategy,
  OrderItemVbankReadyStrategy,
  OrderItemVbankDodgedStrategy,
  OrderItemPaidStrategy,
  OrderItemShipReadyStrategy,
  OrderItemShippingStrategy,
  OrderItemCancelledStrategy,
  OrderItemRefundRequestedStrategy,
  OrderItemRefundedStrategy,
  OrderItemExchangeRequestedStrategy,
  OrderItemExchangedStrategy,
} from '../strategies';

const { Failed, VbankReady, VbankDodged, Paid, ShipReady, Shipping } =
  OrderItemStatus;
const { Cancelled, RefundRequested, Refunded, ExchangeRequested, Exchanged } =
  OrderItemClaimStatus;

export class OrderItemMarkStrategyFactory {
  static from(
    status: OrderItemStatus | OrderItemClaimStatus,
    orderItem: OrderItem
  ): OrderItemMarkStrategy {
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
      case RefundRequested:
        return new OrderItemRefundRequestedStrategy(orderItem);
      case Refunded:
        return new OrderItemRefundedStrategy(orderItem);
      case ExchangeRequested:
        return new OrderItemExchangeRequestedStrategy(orderItem);
      case Exchanged:
        return new OrderItemExchangedStrategy(orderItem);

      default:
        throw new InternalServerErrorException(
          'Invalide OrderItemStatus to mark'
        );
    }
  }
}
