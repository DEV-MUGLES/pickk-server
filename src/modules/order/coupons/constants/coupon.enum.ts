import { registerEnumType } from '@nestjs/graphql';

export enum CouponType {
  Rate = 'Rate',
  Amount = 'Amount',
}

registerEnumType(CouponType, {
  name: 'CouponType',
  description: '쿠폰 분류입니다. 정률적용(Rate), 정액적용(Amount)',
});

export enum CouponStatus {
  Ready = 'Ready',
  Applied = 'Applied',
}

registerEnumType(CouponStatus, {
  name: 'CouponStatus',
  description: '쿠폰 상태입니다. 사용가능(Ready), 사용됨(Applied)',
});
