import { Field, InputType } from '@nestjs/graphql';

import { IInquiry } from '@item/inquiries/interfaces';
import { InquiryType } from '@item/inquiries/constants';

@InputType()
export class InquirySearchFilter implements Partial<IInquiry> {
  @Field({ nullable: true })
  isAnswered?: boolean;
  @Field({ nullable: true })
  type?: InquiryType;
  @Field({ nullable: true })
  orderItemMerchantUid?: string;

  @Field({ nullable: true })
  orderBuyerName?: string;
  @Field({ nullable: true })
  userNickname?: string;
  @Field({ nullable: true })
  itemName?: string;

  @Field(() => [Date, Date], { nullable: true })
  createdAtBetween?: [Date, Date];
}
