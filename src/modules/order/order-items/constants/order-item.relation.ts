import { OrderItem } from '../models';

export type OrderItemRelationType =
  | keyof OrderItem
  | 'item.brand'
  | 'seller.claimPolicy'
  | 'seller.settlePolicy'
  | 'seller.shippingPolicy'
  | 'order.buyer'
  | 'order.receiver'
  | 'shipment.courier'
  | 'shipment.histories';

// @TODO: 현재 TypeORM 기능 문제로 2중 nested 필터링이 지원되지 않습니다. 해결해야함
export const ORDER_ITEM_RELATIONS: Array<OrderItemRelationType> = [
  'user',
  'product',
  'item',
  'item.brand',
  'seller',
  'seller.settlePolicy',
  'seller.shippingPolicy',
  'order',
  'order.buyer',
  'order.receiver',
  'campaign',
  'shipment',
  'shipment.courier',
  'shipment.histories',
  'refundRequest',
  'exchangeRequest',
];

export const EXCHANGE_ORDER_ITEM_RELATIONS: Array<OrderItemRelationType> = [
  'seller',
  'seller.claimPolicy',
  'seller.shippingPolicy',
];
