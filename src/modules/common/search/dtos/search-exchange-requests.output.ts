import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { ExchangeRequest } from '@order/exchange-requests/models';

@ObjectType()
export class SearchExchangeRequestsOutput {
  @Field(() => Int)
  total: number;

  @Field(() => [ExchangeRequest])
  @Type(() => ExchangeRequest)
  result: ExchangeRequest[];
}
