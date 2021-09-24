import { Field, InputType, Int } from '@nestjs/graphql';

import { IInquiry } from '../interfaces';
import { Inquiry } from '../models';

@InputType()
export class InquiryFilter implements Partial<IInquiry> {
  searchFields?: Array<keyof Inquiry> = ['orderItemMerchantUid'];
  @Field({ nullable: true, description: '주문상품번호로 검색 가능' })
  search?: string;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => Int, { nullable: true })
  itemId?: number;

  @Field(() => Int, { nullable: true })
  sellerId?: number;

  @Field({ nullable: true })
  isAnswered?: boolean;
}
