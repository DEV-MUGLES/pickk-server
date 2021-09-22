import { registerEnumType } from '@nestjs/graphql';

export enum ShipmentOwnerType {
  EXCHANGE_REQUEST_PICK = 'EXCHANGE_REQUEST_PICK',
  EXCHANGE_REQUEST_RESHIP = 'EXCHANGE_REQUEST_RESHIP',
  REFUND_REQUEST = 'REFUND_REQUEST',
  ORDER_ITEM = 'ORDER_ITEM',
}

registerEnumType(ShipmentOwnerType, {
  name: 'ShipmentOwnerType',
  description: '배송 연관 객체 분류입니다.',
});

export enum ShipmentStatus {
  SHIPPING = 'SHIPPING',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

registerEnumType(ShipmentStatus, {
  name: 'ShipmentStatus',
});
