import { registerEnumType } from '@nestjs/graphql';

export enum PaymentStatus {
  /** 미결제 */
  Pending = 'pending',
  /** 가상계좌 입금대기 */
  VbankReady = 'vbank_ready',
  /** 결제완료 */
  Paid = 'paid',
  /** 전액취소 */
  Cancelled = 'cancelled',
  /** 부분취소 */
  PartialCancelled = 'partial_cancelled',
  /** 결제실패 */
  Failed = 'failed',
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});
