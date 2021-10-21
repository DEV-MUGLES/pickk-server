import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { RefundRequest } from '@order/refund-requests/models';

@ObjectType()
export class SearchRefundRequestsOutput {
  @Field(() => Int)
  total: number;

  @Field(() => [RefundRequest])
  @Type(() => RefundRequest)
  result: RefundRequest[];
}
