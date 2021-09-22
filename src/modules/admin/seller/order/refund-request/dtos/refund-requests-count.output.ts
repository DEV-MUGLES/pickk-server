import { Field, Int, ObjectType } from '@nestjs/graphql';

import { getEnumValues } from '@common/helpers';

import { RefundRequestStatus } from '@order/refund-requests/constants';
import { RefundRequestEntity } from '@order/refund-requests/entities';

@ObjectType({ description: '생성일 기준 3달 이내의 건들만 count합니다.' })
export class RefundRequestsCountOutput {
  static getCacheKey(sellerId: number) {
    return `refund-requests-count:${sellerId}`;
  }

  static create(
    sellerId: number,
    refundRequests: RefundRequestEntity[]
  ): RefundRequestsCountOutput {
    const count = new RefundRequestsCountOutput({
      id: sellerId,
      lastUpdatedAt: new Date(),
    });

    const countMap = new Map<RefundRequestStatus | 'process_delayed', number>();

    [
      ...(getEnumValues(RefundRequestStatus) as RefundRequestStatus[]),
      'process_delayed' as const,
    ].forEach((value) => {
      countMap.set(value, 0);
    });

    refundRequests.forEach(({ status, isProcessDelaying }) => {
      countMap.set(status, (countMap.get(status) || 0) + 1);

      if (
        isProcessDelaying &&
        [RefundRequestStatus.REQUESTED, RefundRequestStatus.PICKED].includes(
          status
        )
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
    return RefundRequestsCountOutput.getCacheKey(this.id);
  }

  constructor(attributes: Partial<RefundRequestsCountOutput>) {
    Object.assign(this, attributes);

    this.lastUpdatedAt = new Date(this.lastUpdatedAt);
  }

  @Field(() => Int, {
    description: 'sellerId와 동일한 값. Apollo Client 캐싱을 위해 존재합니다.',
  })
  id: number;

  @Field()
  lastUpdatedAt: Date;

  @Field(() => Int, { description: '반품 요청 (= 수거중)' })
  [RefundRequestStatus.REQUESTED]: number;

  @Field(() => Int, { description: '수거 완료' })
  [RefundRequestStatus.PICKED]: number;

  @Field(() => Int, { description: '반품 거부' })
  [RefundRequestStatus.REJECTED]: number;

  @Field(() => Int, { description: '반품 승인' })
  [RefundRequestStatus.CONFIRMED]: number;

  @Field(() => Int, {
    description: '반품 처리 지연 (지연중인 requested + picked)',
  })
  process_delayed: number;
}
