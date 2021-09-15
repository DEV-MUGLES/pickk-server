import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

import { RefundRequestStatus } from '../constants';
import { IRefundRequest } from '../interfaces';
import { RefundRequest } from '../models';

@InputType()
export class RefundRequestOrderFilter {
  @Field(() => [Date, Date], { nullable: true })
  @IsOptional()
  paidAtBetween?: [Date, Date];
}

@InputType()
export class RefundRequestFilter
  implements Partial<Omit<IRefundRequest, 'order'>>
{
  searchFields?: Array<keyof RefundRequest | 'shipment.trackCode'> = [
    'orderMerchantUid',
    'shipment.trackCode',
  ];
  @Field({ nullable: true, description: '주문번호, 운송장번호로 검색' })
  search?: string;

  @Field(() => [String], { nullable: true })
  merchantUidIn?: string[];
  @Field(() => Int, { nullable: true })
  @IsOptional()
  sellerId?: number;

  @Field(() => RefundRequestStatus, {
    nullable: true,
  })
  @IsEnum(RefundRequestStatus)
  @IsOptional()
  status?: RefundRequestStatus;

  @Field(() => [RefundRequestStatus], {
    nullable: true,
  })
  @IsEnum(RefundRequestStatus, { each: true })
  @IsOptional()
  statusIn?: RefundRequestStatus[];

  @Field(() => [Date, Date], { nullable: true })
  @IsOptional()
  requestedAtBetween?: [Date, Date];

  @Field(() => [Date, Date], { nullable: true })
  @IsOptional()
  pickedAtBetween?: [Date, Date];

  @Field(() => [Date, Date], { nullable: true })
  @IsOptional()
  confirmedAtBetween?: [Date, Date];

  @Field(() => RefundRequestOrderFilter, { nullable: true })
  order?: RefundRequestOrderFilter;

  @Field({ nullable: true })
  @IsOptional()
  isProcessDelaying?: boolean;
}
