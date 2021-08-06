import { registerEnumType } from '@nestjs/graphql';

export enum ExchangeRequestStatus {
  Requested = 'requested',
  /** 상품 수거 완료 */
  Picked = 'picked',
  /** 재배송 중 */
  Reshipping = 'reshipping',
  /** 재배송 완료 */
  Reshipped = 'reshipped',
  Rejected = 'rejected',
}

registerEnumType(ExchangeRequestStatus, {
  name: 'ExchangeRequestStatus',
  description: '교한신청 상태입니다.',
});
