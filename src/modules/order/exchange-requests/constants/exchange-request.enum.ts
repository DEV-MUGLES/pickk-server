import { registerEnumType } from '@nestjs/graphql';

export enum ExchangeRequestStatus {
  REQUESTED = 'REQUESTED',
  /** 상품 수거 완료 */
  PICKED = 'PICKED',
  /** 재배송 중 */
  RESHIPPING = 'RESHIPPING',
  /** 재배송 완료 */
  RESHIPPED = 'RESHIPPED',
  REJECTED = 'REJECTED',
}

registerEnumType(ExchangeRequestStatus, {
  name: 'ExchangeRequestStatus',
  description: '교한신청 상태입니다.',
});
