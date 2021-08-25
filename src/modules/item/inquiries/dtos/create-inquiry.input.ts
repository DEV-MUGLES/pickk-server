import { InputType, PickType } from '@nestjs/graphql';

import { Inquiry } from '../models';

@InputType()
export class CreateInquiryInput extends PickType(
  Inquiry,
  [
    'itemId',
    'orderItemMerchantUid',
    'type',
    'title',
    'content',
    'contactPhoneNumber',
    'isSecret',
  ],
  InputType
) {
  userId: number;
  sellerId: number;
}
