import { Field, InputType, Int } from '@nestjs/graphql';

import { RefundRequestStatus } from '@order/refund-requests/constants';
import { IRefundRequest } from '@order/refund-requests/interfaces';

@InputType()
export class RefundRequestSearchFilter implements Partial<IRefundRequest> {
  @Field(() => Int, { nullable: true })
  sellerId?: number;
  @Field({ nullable: true })
  isSettled?: boolean;
  @Field({ nullable: true })
  isProcessDelaying?: boolean;
  @Field({ nullable: true })
  orderBuyerName?: string;

  @Field(() => RefundRequestStatus, { nullable: true })
  status?: RefundRequestStatus;
  @Field(() => [RefundRequestStatus], { nullable: true })
  statusIn?: RefundRequestStatus[];

  @Field(() => [Date, Date], { nullable: true })
  confirmedAtBetween?: [Date, Date];
  @Field(() => [Date, Date], { nullable: true })
  pickedAtBetween?: [Date, Date];
  @Field(() => [Date, Date], { nullable: true })
  rejectedAtBetween?: [Date, Date];
  @Field(() => [Date, Date], { nullable: true })
  requestedAtBetween?: [Date, Date];
  @Field(() => [Date, Date], { nullable: true })
  settledAtBetween?: [Date, Date];
}
