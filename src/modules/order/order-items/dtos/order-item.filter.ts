import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { OrderItemClaimStatus, OrderItemStatus } from '../constants';
import { IOrderItem } from '../interfaces';
import { OrderItem } from '../models';

@InputType()
export class OrderItemFilter implements Partial<IOrderItem> {
  searchFields?: Array<
    | keyof OrderItem
    | 'order.buyer.name'
    | 'order.buyer.phoneNumber'
    | 'order.receiver.name'
  > = [
    'itemName',
    'orderMerchantUid',
    'merchantUid',
    'order.buyer.name',
    'order.buyer.phoneNumber',
    'order.receiver.name',
  ];

  @Field({
    nullable: true,
    description:
      '주문번호, 주문상품번호, 아이템 명으로 검색합니다. 구매자 번호를 검색할 땐 dash를 제거하고 보내주세요!',
  })
  search?: string;

  @Field(() => Int, {
    nullable: true,
  })
  @IsOptional()
  sellerId?: number;

  @Field(() => [String], {
    nullable: true,
  })
  @IsString({ each: true })
  @IsOptional()
  merchantUidIn?: string[];

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
