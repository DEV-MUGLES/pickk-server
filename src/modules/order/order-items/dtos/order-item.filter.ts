import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

import { OrderItemClaimStatus, OrderItemStatus } from '../constants';
import { IOrderItem } from '../interfaces';
import { OrderItem } from '../models';

@InputType()
export class OrderItemFilter implements Partial<IOrderItem> {
  searchFields: Array<keyof OrderItem> = ['orderMerchantUid', 'merchantUid'];

  @Field({
    nullable: true,
    description: '주문번호, 주문상품번호로 검색합니다.',
  })
  search: string;

  @Field(() => Int, {
    nullable: true,
  })
  @IsOptional()
  sellerId?: number;

  @Field(() => OrderItemStatus, {
    nullable: true,
  })
  @IsEnum(OrderItemStatus)
  @IsOptional()
  status?: OrderItemStatus;

  @Field(() => [OrderItemStatus], {
    nullable: true,
  })
  @IsEnum(OrderItemStatus, { each: true })
  @IsOptional()
  statusIn?: OrderItemStatus[];

  @Field(() => OrderItemClaimStatus, {
    nullable: true,
  })
  @IsEnum(OrderItemClaimStatus)
  @IsOptional()
  claimStatus?: OrderItemClaimStatus;

  @Field(() => [OrderItemClaimStatus], {
    nullable: true,
  })
  @IsEnum(OrderItemClaimStatus, { each: true })
  @IsOptional()
  claimStatusIn?: OrderItemClaimStatus[];

  @Field(() => [Date, Date], { nullable: true })
  @IsOptional()
  paidAtBetween?: [Date, Date];

  @Field(() => [Date, Date], { nullable: true })
  @IsOptional()
  shipReadyAtBetween?: [Date, Date];

  @Field(() => [Date, Date], { nullable: true })
  @IsOptional()
  shippingAtBetween?: [Date, Date];

  @Field(() => [Date, Date], { nullable: true })
  @IsOptional()
  shippedAtBetween?: [Date, Date];
}
