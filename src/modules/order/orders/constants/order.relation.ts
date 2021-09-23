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
  | 'orderItems.item'
  | 'orderItems.seller'
  | 'orderItems.seller.brand'
  | 'orderItems.seller.claimPolicy'
  | 'orderItems.seller.shippingPolicy';

export const ORDER_RELATIONS: Array<OrderRelationType> = [
  'user',
  'orderItems',
  'orderItems.product',
  'orderItems.product.item',
  'orderItems.product.item.prices',
  'orderItems.product.item.brand',
  'orderItems.product.item.brand.seller',
  'orderItems.product.item.brand.seller.shippingPolicy',
  'orderItems.product.shippingReservePolicy',
  'orderItems.item',
  'orderItems.seller',
  'orderItems.seller.brand',
  'orderItems.seller.shippingPolicy',
  'buyer',
  'receiver',
  'vbankReceipt',
  'refundRequests',
  'refundRequests.shipment',
  'refundRequests.shipment.courier',
];

export const CHECKOUT_ORDER_RELATIONS: Array<OrderRelationType> = [
  'orderItems',
  'orderItems.item',
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
  'orderItems.seller',
  'orderItems.seller.brand',
  'orderItems.seller.shippingPolicy',
  'orderItems.product',
  'orderItems.product.item',
  'vbankReceipt',
  'receiver',
  'buyer',
];

export const REFUND_ORDER_RELATIONS: Array<OrderRelationType> = [
  'user',
  'orderItems',
  'orderItems.seller',
  'orderItems.seller.claimPolicy',
  'orderItems.seller.shippingPolicy',
  'refundRequests',
];
