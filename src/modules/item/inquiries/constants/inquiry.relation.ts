import { Inquiry } from '../models';

export type InquiryRelationType = keyof Inquiry | 'item.brand' | 'seller.brand';

export const INQUIRY_RELATIONS: InquiryRelationType[] = [
  'user',
  'answers',
  'item',
  'item.brand',
  'orderItem',
];
