import { Field, InputType, Int } from '@nestjs/graphql';

import { ExchangeRequestStatus } from '@order/exchange-requests/constants';
import { IExchangeRequest } from '@order/exchange-requests/interfaces';

@InputType()
export class ExchangeRequestSearchFilter implements Partial<IExchangeRequest> {
  @Field(() => Int, { nullable: true })
  sellerId?: number;
  @Field(() => Int, { nullable: true })
  productId?: number;
  @Field({ nullable: true })
  isSettled?: boolean;
  @Field({ nullable: true })
  isProcessDelaying?: boolean;
  @Field({ nullable: true })
  orderBuyerName?: string;

  @Field(() => ExchangeRequestStatus, { nullable: true })
  status?: ExchangeRequestStatus;
  @Field(() => [ExchangeRequestStatus], { nullable: true })
  statusIn?: ExchangeRequestStatus[];

  @Field(() => [Date, Date], { nullable: true })
  pickedAtBetween?: [Date, Date];
  @Field(() => [Date, Date], { nullable: true })
  reshippingAtBetween?: [Date, Date];
  @Field(() => [Date, Date], { nullable: true })
  reshippedAtBetween?: [Date, Date];
  @Field(() => [Date, Date], { nullable: true })
  convertedAtBetween?: [Date, Date];
  @Field(() => [Date, Date], { nullable: true })
  rejectedAtBetween?: [Date, Date];
  @Field(() => [Date, Date], { nullable: true })
  requestedAtBetween?: [Date, Date];
  @Field(() => [Date, Date], { nullable: true })
  settledAtBetween?: [Date, Date];
}
