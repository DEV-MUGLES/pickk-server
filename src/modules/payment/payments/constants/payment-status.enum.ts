import { registerEnumType } from '@nestjs/graphql';

export enum PaymentStatus {
  /** 미결제 */
  PENDING = 'PENDING',
  /** 가상계좌 입금대기 */
  VBANK_READY = 'VBANK_READY',
  /** 결제완료 */
  PAID = 'PAID',
  /** 전액취소 */
  CANCELLED = 'CANCELLED',
  /** 부분취소 */
  PARTIAL_CANCELLED = 'PARTIAL_CANCELLED',
  /** 가상계좌 입금 전 취소 */
  VBANK_DODGED = 'VBANK_DODGED',
  /** 결제실패 */
  FAILED = 'FAILED',
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});
