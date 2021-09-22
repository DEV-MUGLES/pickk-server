import { registerEnumType } from '@nestjs/graphql';

export enum CouponType {
  RATE = 'RATE',
  AMOUNT = 'AMOUNT',
}

registerEnumType(CouponType, {
  name: 'CouponType',
  description: '쿠폰 분류입니다. 정률적용(RATE), 정액적용(AMOUNT)',
});

export enum CouponStatus {
  READY = 'READY',
  APPLIED = 'APPLIED',
}

registerEnumType(CouponStatus, {
  name: 'CouponStatus',
  description: '쿠폰 상태입니다. 사용가능(READY), 사용됨(APPLIED)',
});
