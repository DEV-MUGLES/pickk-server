import { Order } from '../models';

export type OrderRelationType =
  | keyof Order
  | 'refundRequests.shipment'
  | 'refundRequests.shipment.courier';

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
