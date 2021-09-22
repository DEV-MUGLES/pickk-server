import { registerEnumType } from '@nestjs/graphql';

export enum ShipmentOwnerType {
  ExchangeRequestPick = 'ExchangeRequestPick',
  ExchangeRequestReship = 'ExchangeRequestReship',
  RefundRequest = 'RefundRequest',
  OrderItem = 'OrderItem',
}

registerEnumType(ShipmentOwnerType, {
  name: 'ShipmentOwnerType',
  description: '배송 연관 객체 분류입니다.',
});

export enum ShipmentStatus {
  Shipping = 'Shipping',
  Shipped = 'Shipped',
  Cancelled = 'Cancelled',
  Failed = 'Failed',
}

registerEnumType(ShipmentStatus, {
  name: 'ShipmentStatus',
});
