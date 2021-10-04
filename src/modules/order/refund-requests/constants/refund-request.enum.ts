import { registerEnumType } from '@nestjs/graphql';

export enum RefundRequestStatus {
  Requested = 'Requested',
  /** 상품 수거 완료 */
  Picked = 'Picked',
  Rejected = 'Rejected',
  Confirmed = 'Confirmed',
}

registerEnumType(RefundRequestStatus, {
  name: 'RefundRequestStatus',
  description: '반품요청 상태입니다.',
});

export enum OrderClaimFaultOf {
  Customer = 'Customer',
  Seller = 'Seller',
}

registerEnumType(OrderClaimFaultOf, {
  name: 'OrderClaimFaultOf',
  description: '교환/반품 책임자?입니다. (구매자 or 판매자)',
});
