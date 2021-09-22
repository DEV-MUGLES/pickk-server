import { registerEnumType } from '@nestjs/graphql';

export enum PaymentStatus {
  /** 미결제 */
  Pending = 'Pending',
  /** 가상계좌 입금대기 */
  VbankReady = 'VbankReady',
  /** 결제완료 */
  Paid = 'Paid',
  /** 전액취소 */
  Cancelled = 'Cancelled',
  /** 부분취소 */
  PartialCancelled = 'PartialCancelled',
  /** 가상계좌 입금 전 취소 */
  VbankDodged = 'VbankDodged',
  /** 결제실패 */
  Failed = 'Failed',
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});
