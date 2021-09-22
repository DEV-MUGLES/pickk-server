import { registerEnumType } from '@nestjs/graphql';

export enum RefundRequestStatus {
  REQUESTED = 'REQUESTED',
  /** 상품 수거 완료 */
  PICKED = 'PICKED',
  REJECTED = 'REJECTED',
  CONFIRMED = 'CONFIRMED',
}

registerEnumType(RefundRequestStatus, {
  name: 'RefundRequestStatus',
  description: '반품요청 상태입니다.',
});

export enum OrderClaimFaultOf {
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
}

registerEnumType(OrderClaimFaultOf, {
  name: 'RefundRequestFaultOf',
  description: '교환/반품 책임자?입니다. (구매자 or 판매자)',
});
