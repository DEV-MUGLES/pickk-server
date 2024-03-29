import { RefundRequest } from '../models';

export type RefundRequestRelationType =
  | keyof RefundRequest
  | 'seller.courier'
  | 'seller.brand'
  | 'seller.returnAddress'
  | 'shipment.courier'
  | 'order.buyer';

export const REFUND_REQUEST_RELATIONS: Array<RefundRequestRelationType> = [
  'user',
  'orderItems',
  'order',
  'order.buyer',
  'seller',
  'seller.courier',
  'seller.returnAddress',
  'shipment',
  'shipment.courier',
];
