import { registerEnumType } from '@nestjs/graphql';

export enum ExchangeRequestStatus {
  Pending = 'Pending',
  Requested = 'Requested',
  /** 상품 수거 완료 */
  Picked = 'Picked',
  /** 재배송 중 */
  Reshipping = 'Reshipping',
  /** 재배송 완료 */
  Reshipped = 'Reshipped',
  Rejected = 'Rejected',
  /** 반품으로 변경됨 */
  Converted = 'Converted',
  Canceled = 'Canceled',
}

registerEnumType(ExchangeRequestStatus, {
  name: 'ExchangeRequestStatus',
  description: '교한신청 상태입니다.',
});
