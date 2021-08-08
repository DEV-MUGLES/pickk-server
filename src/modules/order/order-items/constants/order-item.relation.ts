import { OrderItem } from '../models';

export type OrderItemRelationType =
  | keyof OrderItem
  | 'item.brand'
  | 'seller.shippingPolicy';

export const ORDER_ITEM_RELATIONS: Array<OrderItemRelationType> = [
  'user',
  'product',
  'exchangeRequest',
  'item',
  'item.brand',
  'seller',
  'seller.shippingPolicy',
];
