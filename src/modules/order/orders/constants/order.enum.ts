import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAYING = 'PAYING',
  FAILED = 'FAILED',
  VBANK_READY = 'VBANK_READY',
  /** 발주 전 즉시 취소된 경우 */
  VBANK_DODGED = 'VBANK_DODGED',
  PAID = 'PAID',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: '주문 상태입니다. 클라이언트에선 거의 사용되지 않을 값입니다.',
});
