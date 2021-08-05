import { Order } from '../models';

export type OrderRelationType = keyof Order;

export const ORDER_RELATIONS: Array<OrderRelationType> = [
  'user',
  'orderItems',
  'buyer',
  'receiver',
  'vbankInfo',
  'refundRequests',
];
