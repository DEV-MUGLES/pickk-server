import { Field, InputType } from '@nestjs/graphql';

import { IInquiry } from '../interfaces';

@InputType()
export class InquiryFilter implements Partial<IInquiry> {
  @Field({ nullable: true })
  itemId: number;
}
