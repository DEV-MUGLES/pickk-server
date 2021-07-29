import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  Pending = 'pending',
  Paying = 'paying',
  Failed = 'failed',
  VbankReady = 'vbank_ready',
  /** 발주 전 즉시 취소된 경우 */
  VbankDodged = 'vbank_dodged',
  Paid = 'paid',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: '주문 상태입니다. 클라이언트에선 거의 사용되지 않을 값입니다.',
});
