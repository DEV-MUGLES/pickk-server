import { InquiryRelationType } from '@item/inquiries/constants';

export const INQUIRY_SEARCH_INDEX_RELATIONS: InquiryRelationType[] = [
  'orderItem',
  'orderItem.order',
  'orderItem.order.buyer',
  'item',
  'user',
];
