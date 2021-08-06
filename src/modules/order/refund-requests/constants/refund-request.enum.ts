import { registerEnumType } from '@nestjs/graphql';

export enum RefundRequestStatus {
  Requested = 'requested',
  /** 상품 수거 완료 */
  Picked = 'picked',
  Rejected = 'rejected',
  Confirmed = 'confirmed',
}

registerEnumType(RefundRequestStatus, {
  name: 'RefundRequestStatus',
  description: '반품요청 상태입니다.',
});

export enum OrderClaimFaultOf {
  Customer = 'customer',
  Seller = 'seller',
}

registerEnumType(OrderClaimFaultOf, {
  name: 'RefundRequestFaultOf',
  description: '반품 책임자?입니다. (구매자 or 판매자)',
});
