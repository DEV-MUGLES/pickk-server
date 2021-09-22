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

const { FAILED, VBANK_READY, VBANK_DODGED, PAID, SHIP_READY, SHIPPING } =
  OrderItemStatus;
const { CANCELLED, REFUND_REQUESTED, REFUNDED, EXCHANGE_REQUESTED, EXCHANGED } =
  OrderItemClaimStatus;

export class OrderItemMarkStrategyFactory {
  static from(
    status: OrderItemStatus | OrderItemClaimStatus,
    orderItem: OrderItem
  ): OrderItemMarkStrategy {
    switch (status) {
      case FAILED:
        return new OrderItemFailedStrategy(orderItem);
      case VBANK_READY:
        return new OrderItemVbankReadyStrategy(orderItem);
      case VBANK_DODGED:
        return new OrderItemVbankDodgedStrategy(orderItem);
      case PAID:
        return new OrderItemPaidStrategy(orderItem);

      case SHIP_READY:
        return new OrderItemShipReadyStrategy(orderItem);
      case SHIPPING:
        return new OrderItemShippingStrategy(orderItem);

      case CANCELLED:
        return new OrderItemCancelledStrategy(orderItem);
      case REFUND_REQUESTED:
        return new OrderItemRefundRequestedStrategy(orderItem);
      case REFUNDED:
        return new OrderItemRefundedStrategy(orderItem);
      case EXCHANGE_REQUESTED:
        return new OrderItemExchangeRequestedStrategy(orderItem);
      case EXCHANGED:
        return new OrderItemExchangedStrategy(orderItem);

      default:
        throw new InternalServerErrorException(
          'Invalide OrderItemStatus to mark'
        );
    }
  }
}
