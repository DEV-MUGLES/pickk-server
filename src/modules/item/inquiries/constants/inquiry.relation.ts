import { Inquiry } from '../models';

export type InquiryRelationType =
  | keyof Inquiry
  | 'item.brand'
  | 'seller.brand'
  | 'orderItem.order'
  | 'orderItem.order.buyer';

export const INQUIRY_RELATIONS: InquiryRelationType[] = [
  'user',
  'answers',
  'item',
  'item.brand',
  'orderItem',
  'orderItem.order',
  'orderItem.order.buyer',
];
