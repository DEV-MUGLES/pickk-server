import { Field, Int, ObjectType } from '@nestjs/graphql';

import { getEnumValues } from '@common/helpers';

import { ExchangeRequestStatus } from '@order/exchange-requests/constants';
import { ExchangeRequestEntity } from '@order/exchange-requests/entities';

@ObjectType({ description: '생성일 기준 1달 이내의 건들만 count합니다.' })
export class ExchangeRequestsCountOutput {
  static getCacheKey(sellerId: number) {
    return `erc:${sellerId}`;
  }

  static create(
    sellerId: number,
    exchangeRequests: ExchangeRequestEntity[]
  ): ExchangeRequestsCountOutput {
    const count = new ExchangeRequestsCountOutput({
      id: sellerId,
      lastUpdatedAt: new Date(),
    });

    const countMap = new Map<
      ExchangeRequestStatus | 'process_delayed',
      number
    >();

    [
      ...(getEnumValues(ExchangeRequestStatus) as ExchangeRequestStatus[]),
      'process_delayed' as const,
    ].forEach((value) => {
      countMap.set(value, 0);
    });

    exchangeRequests.forEach(({ status, isProcessDelaying }) => {
      countMap.set(status, (countMap.get(status) || 0) + 1);

      if (
        isProcessDelaying &&
        [
          ExchangeRequestStatus.Requested,
          ExchangeRequestStatus.Picked,
        ].includes(status)
      ) {
        countMap.set(
          'process_delayed',
          (countMap.get('process_delayed') || 0) + 1
        );
      }
    });

    countMap.forEach((value, key) => {
      count[key] = value;
    });

    return count;
  }

  get cacheKey(): string {
    return ExchangeRequestsCountOutput.getCacheKey(this.id);
  }

  constructor(attributes: Partial<ExchangeRequestsCountOutput>) {
    Object.assign(this, attributes);
    this.lastUpdatedAt = new Date(this.lastUpdatedAt);
  }

  @Field(() => Int, {
    description: 'sellerId와 동일한 값. Apollo Client 캐싱을 위해 존재합니다.',
  })
  id: number;

  @Field()
  lastUpdatedAt: Date;

  @Field(() => Int, { description: '교환 요청 (= 수거중)' })
  [ExchangeRequestStatus.Requested]: number;

  @Field(() => Int, { description: '수거 완료' })
  [ExchangeRequestStatus.Picked]: number;

  @Field(() => Int, { description: '교환 거부' })
  [ExchangeRequestStatus.Rejected]: number;

  @Field(() => Int, { description: '교환 배송 중' })
  [ExchangeRequestStatus.Reshipping]: number;

  @Field(() => Int, { description: '교환 배송 완료' })
  [ExchangeRequestStatus.Reshipped]: number;

  @Field(() => Int, {
    description: '교환 처리 지연 (지연중인 requested + picked)',
  })
  process_delayed: number;
}
