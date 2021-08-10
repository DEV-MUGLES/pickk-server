import { Field, Int, ObjectType } from '@nestjs/graphql';

import { getEnumValues } from '@common/helpers';

import {
  OrderItemStatus,
  OrderItemClaimStatus,
} from '@order/order-items/constants';
import { OrderItemEntity } from '@order/order-items/entities';

@ObjectType({ description: '생성일 기준 1달 이내의 건들만 count합니다.' })
export class OrderItemsCountOutput {
  static getCacheKey(sellerId: number) {
    return `oic:${sellerId}`;
  }

  static create(
    sellerId: number,
    orderItems: OrderItemEntity[]
  ): OrderItemsCountOutput {
    const count = new OrderItemsCountOutput({
      id: sellerId,
      lastUpdatedAt: new Date(),
    });

    const countMap = new Map<OrderItemStatus | OrderItemClaimStatus, number>();

    [
      ...(getEnumValues(OrderItemStatus) as OrderItemStatus[]),
      ...(getEnumValues(OrderItemClaimStatus) as OrderItemClaimStatus[]),
    ].forEach((value) => {
      countMap.set(value, 0);
    });

    orderItems.forEach(({ status, claimStatus }) => {
      countMap.set(status, (countMap.get(status) || 0) + 1);
      countMap.set(claimStatus, (countMap.get(claimStatus) || 0) + 1);
    });

    countMap.forEach((value, key) => {
      count[key] = value;
    });

    return count;
  }

  get cacheKey(): string {
    return OrderItemsCountOutput.getCacheKey(this.id);
  }

  constructor(attributes: Partial<OrderItemsCountOutput>) {
    Object.assign(this, attributes);
  }

  @Field(() => Int, {
    description: 'sellerId와 동일한 값. Apollo Client 캐싱을 위해 존재합니다.',
  })
  id: number;

  @Field()
  lastUpdatedAt: Date;

  @Field(() => Int, { description: '결제대기 (입금대기와 다릅니다.)' })
  [OrderItemStatus.Pending]: number;

  @Field(() => Int, { description: '결제 실패' })
  [OrderItemStatus.Failed]: number;

  @Field(() => Int, { description: '입금 대기' })
  [OrderItemStatus.VbankReady]: number;

  @Field(() => Int, { description: '입금 전 취소' })
  [OrderItemStatus.VbankDodged]: number;

  @Field(() => Int, { description: '결제 완료' })
  [OrderItemStatus.Paid]: number;

  @Field(() => Int, { description: '배송 보류중(예약중)' })
  [OrderItemStatus.ShipPending]: number;

  @Field(() => Int, { description: '배송 준비중' })
  [OrderItemStatus.ShipReady]: number;

  @Field(() => Int, { description: '배송 중' })
  [OrderItemStatus.Shipping]: number;

  @Field(() => Int, { description: '배송 완료' })
  [OrderItemStatus.Shipped]: number;

  @Field(() => Int, {
    deprecationReason: '현재 취소는 신청 즉시 완료됩니다.',
    description: '취소 요청됨 (deprecated)',
  })
  [OrderItemClaimStatus.CancelRequested]: number;

  @Field(() => Int, { description: '취소 완료' })
  [OrderItemClaimStatus.Cancelled]: number;

  @Field(() => Int, { description: '교환 요청됨' })
  [OrderItemClaimStatus.ExchangeRequested]: number;

  @Field(() => Int, { description: '교환 완료' })
  [OrderItemClaimStatus.Exchanged]: number;

  @Field(() => Int, { description: '반품 요청됨' })
  [OrderItemClaimStatus.RefundRequested]: number;

  @Field(() => Int, { description: '반품 완료' })
  [OrderItemClaimStatus.Refunded]: number;
}
