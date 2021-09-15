import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { ExchangeRequestStatus } from '../constants';

import { IExchangeRequest } from '../interfaces';
import { ExchangeRequest } from '../models';

@InputType()
export class ExchangeRequestOrderItemFilter {
  @Field(() => [Date, Date], { nullable: true })
  @IsOptional()
  paidAtBetween?: [Date, Date];
}

@InputType()
export class ExchangeRequestFilter
  implements Partial<Omit<IExchangeRequest, 'orderItem'>>
{
  searchFields?: Array<
    keyof ExchangeRequest | 'pickShipment.trackCode' | 'reShipment.trackCode'
  > = [
    'orderItemMerchantUid',
    'pickShipment.trackCode',
    'reShipment.trackCode',
  ];
  @Field({
    nullable: true,
    description: '주문상품번호, 회수 운송장번호, 재배송 운송장번호로 검색',
  })
  search?: string;

  @Field(() => [String], { nullable: true })
  merchantUidIn?: string[];

  @Field(() => Int, {
    nullable: true,
  })
  @IsOptional()
  sellerId?: number;

  @Field(() => ExchangeRequestOrderItemFilter, { nullable: true })
  orderItem?: ExchangeRequestOrderItemFilter;

  @Field(() => [Date, Date], { nullable: true })
  @IsOptional()
  requestedAtBetween?: [Date, Date];

  @Field(() => [Date, Date], {
    description: '재배송 완료일 (기간). 교환 완료와 동일한 의미로 사용됩니다.',
    nullable: true,
  })
  @IsOptional()
  reshippedAtBetween?: [Date, Date];

  @Field(() => ExchangeRequestStatus, {
    nullable: true,
  })
  @IsEnum(ExchangeRequestStatus)
  @IsOptional()
  status?: ExchangeRequestStatus;

  @Field(() => [ExchangeRequestStatus], {
    nullable: true,
  })
  @IsEnum(ExchangeRequestStatus, { each: true })
  @IsOptional()
  statusIn?: ExchangeRequestStatus[];

  @Field({ nullable: true })
  @IsOptional()
  isProcessDelaying?: boolean;
}
