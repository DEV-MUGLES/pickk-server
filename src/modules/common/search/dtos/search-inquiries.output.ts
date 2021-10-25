import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Inquiry } from '@item/inquiries/models';

@ObjectType()
export class SearchInquiriesOutput {
  @Field(() => Int)
  total: number;

  @Field(() => [Inquiry])
  @Type(() => Inquiry)
  result: Inquiry[];
}
