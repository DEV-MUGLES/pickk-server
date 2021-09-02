import { Order } from '../models';

export type OrderRelationType =
  | keyof Order
  | 'refundRequests.shipment'
  | 'refundRequests.shipment.courier'
  | 'orderItems.product'
  | 'orderItems.product.item'
  | 'orderItems.product.item.prices'
  | 'orderItems.product.item.brand'
  | 'orderItems.product.item.brand.seller'
  | 'orderItems.product.item.brand.seller.shippingPolicy'
  | 'orderItems.product.shippingReservePolicy'
  | 'orderItems.seller'
  | 'orderItems.seller.brand'
  | 'orderItems.seller.shippingPolicy';

export const ORDER_RELATIONS: Array<OrderRelationType> = [
  'user',
  'orderItems',
  'buyer',
  'receiver',
  'vbankInfo',
  'refundRequests',
  'refundRequests.shipment',
  'refundRequests.shipment.courier',
];

export const CHECKOUT_ORDER_RELATIONS: Array<OrderRelationType> = [
  'orderItems',
  'orderItems.product',
  'orderItems.product.item',
  'orderItems.product.item.prices',
  'orderItems.product.shippingReservePolicy',
  'orderItems.seller',
  'orderItems.seller.brand',
  'orderItems.seller.shippingPolicy',
];

export const START_ORDER_RELATIONS: Array<OrderRelationType> = [
  'orderItems',
  'orderItems.product',
  'orderItems.product.item',
  'orderItems.product.item.prices',
  'orderItems.product.shippingReservePolicy',
];

export const CANCEL_ORDER_RELATIONS: Array<OrderRelationType> = [
  'orderItems',
  'orderItems.product',
  'orderItems.product.item',
  'orderItems.product.item.brand',
  'orderItems.product.item.brand.seller',
  'orderItems.product.item.brand.seller.shippingPolicy',
  'vbankInfo',
];

export const REFUND_ORDER_RELATIONS: Array<OrderRelationType> = [
  'user',
  'orderItems',
  'orderItems.seller',
  'orderItems.seller.shippingPolicy',
  'refundRequests',
];
