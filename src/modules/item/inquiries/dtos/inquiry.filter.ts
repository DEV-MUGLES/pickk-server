import { Field, InputType, Int } from '@nestjs/graphql';

import { IInquiry } from '../interfaces';

@InputType()
export class InquiryFilter implements Partial<IInquiry> {
  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => Int, { nullable: true })
  itemId?: number;

  @Field(() => Int, { nullable: true })
  sellerId?: number;
}
