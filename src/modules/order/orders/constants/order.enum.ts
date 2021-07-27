import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  Pending = 'pending',
  Paying = 'paying',
  Failed = 'failed',
  VbankReady = 'vbank_ready',
  Paid = 'paid',
  /** 발주 전 즉시 취소된 경우만 Withdrawn으로 변경됨 */
  Withdrawn = 'withdrawn',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: '주문 상태입니다. 클라이언트에선 거의 사용되지 않을 값입니다.',
});
