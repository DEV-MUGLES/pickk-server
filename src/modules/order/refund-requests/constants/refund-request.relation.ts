import { RefundRequest } from '../models';

export type RefundRequestRelationType =
  | keyof RefundRequest
  | 'seller.courier'
  | 'seller.returnAddress';

export const REFUND_REQUEST_RELATIONS: Array<RefundRequestRelationType> = [
  'user',
  'orderItems',
  'order',
  'seller',
  'seller.courier',
  'seller.returnAddress',
];
