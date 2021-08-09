import { registerEnumType } from '@nestjs/graphql';

export enum ShipmentOwnerType {
  ExchangeRequestPick = 'exchange_request_pick',
  ExchangeRequestReShip = 'exchange_request_reship',
  RefundRequest = 'refund_request',
  OrderItem = 'order_item',
}

registerEnumType(ShipmentOwnerType, {
  name: 'ShipmentOwnerType',
  description: '배송 연관 객체 분류입니다.',
});

export enum ShipmentStatus {
  Shipping = 'shipping',
  Shipped = 'shipped',
  Cancelled = 'cancelled',
  Failed = 'failed',
}

registerEnumType(ShipmentStatus, {
  name: 'ShipmentStatus',
});
