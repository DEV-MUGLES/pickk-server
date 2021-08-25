import { Inquiry } from '../models';

export type InquiryRelationType = keyof Inquiry | 'item.brand';

export const INQUIRY_RELATIONS: InquiryRelationType[] = [
  'user',
  'answers',
  'item',
  'item.brand',
];