import { RefundRequest } from '../models';

export type RefundRequestRelationType =
  | keyof RefundRequest
  | 'seller.courier'
  | 'seller.returnAddress'
  | 'shipment.courier'
  | 'order.buyer';

export const REFUND_REQUEST_RELATIONS: Array<RefundRequestRelationType> = [
  'user',
  'orderItems',
  'order',
  'seller',
  'seller.courier',
  'seller.returnAddress',
  'shipment',
  'shipment.courier',
];
