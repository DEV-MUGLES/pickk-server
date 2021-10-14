import { Field, InputType, Int } from '@nestjs/graphql';

import {
  OrderItemClaimStatus,
  OrderItemStatus,
} from '@order/order-items/constants';
import { IOrderItem } from '@order/order-items/interfaces';

@InputType()
export class OrderItemSearchFilter implements Partial<IOrderItem> {
  @Field(() => Int, { nullable: true })
  sellerId?: number;
  @Field({ nullable: true })
  isConfirmed?: boolean;
  @Field({ nullable: true })
  isSettled?: boolean;

  @Field(() => OrderItemStatus, { nullable: true })
  status?: OrderItemStatus;
  @Field(() => [OrderItemStatus], { nullable: true })
  statusIn?: OrderItemStatus[];
  @Field(() => OrderItemClaimStatus, { nullable: true })
  claimStatus?: OrderItemClaimStatus;
  @Field(() => [OrderItemClaimStatus], { nullable: true })
  claimStatusIn?: OrderItemClaimStatus[];
  @Field(() => Boolean, { nullable: true })
  claimStatusIsNull?: boolean;

  @Field(() => [Date, Date], { nullable: true })
  paidAtBetween?: [Date, Date];
  @Field(() => [Date, Date], { nullable: true })
  shipReadyAtBetween?: [Date, Date];
  @Field(() => [Date, Date], { nullable: true })
  shippingAtBetween?: [Date, Date];
  @Field(() => [Date, Date], { nullable: true })
  shippedAtBetween?: [Date, Date];
  @Field(() => [Date, Date], { nullable: true })
  confirmedAtBetween?: [Date, Date];
  @Field(() => [Date, Date], { nullable: true })
  settledAtBetween?: [Date, Date];
}
