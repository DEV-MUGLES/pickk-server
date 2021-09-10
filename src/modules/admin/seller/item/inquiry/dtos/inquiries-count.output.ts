import { Field, Int, ObjectType } from '@nestjs/graphql';
import dayjs from 'dayjs';

import { IInquiry } from '@item/inquiries/interfaces';

@ObjectType({ description: '생성일 기준 3달 이내의 건들만 count합니다.' })
export class InquiriesCountOutput {
  static getCacheKey(sellerId: number) {
    return `inquiries-count:${sellerId}`;
  }

  static create(
    sellerId: number,
    inquiries: Pick<IInquiry, 'createdAt'>[]
  ): InquiriesCountOutput {
    const count = new InquiriesCountOutput({
      id: sellerId,
      lastUpdatedAt: new Date(),
    });

    const countMap = new Map<'not_answered' | 'delayed', number>();

    (['not_answered', 'delayed'] as const).forEach((value) => {
      countMap.set(value, 0);
    });

    inquiries.forEach(({ createdAt }) => {
      countMap.set('not_answered', (countMap.get('not_answered') || 0) + 1);
      if (dayjs().isAfter(createdAt)) {
        countMap.set('delayed', (countMap.get('delayed') || 0) + 1);
      }
    });

    countMap.forEach((value, key) => {
      count[key] = value;
    });

    return count;
  }

  get cacheKey(): string {
    return InquiriesCountOutput.getCacheKey(this.id);
  }

  constructor(attributes: Partial<InquiriesCountOutput>) {
    Object.assign(this, attributes);
    this.lastUpdatedAt = new Date(this.lastUpdatedAt);
  }

  @Field(() => Int, {
    description:
      'sellerId와 동일한 값(or 0). Apollo Client 캐싱을 위해 존재합니다.',
  })
  id: number;

  @Field()
  lastUpdatedAt: Date;

  @Field(() => Int, { description: '미답변' })
  not_answered: number;

  @Field(() => Int, { description: '답변 지연 (생성일 5일 경과)' })
  delayed: number;
}
