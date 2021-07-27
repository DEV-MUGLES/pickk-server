import { BankCode } from '@common/constants';

import { PaymentCancellationType } from '../constants';

export interface IPaymentCancellation {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  type: PaymentCancellationType;
  amount: number;
  reason: string;
  /** 취소요청금액 중 면세금액
   * @default 0 */
  taxFree?: number;
  refundVbankCode?: BankCode;
  refundVbankNum?: string;
  refundVbankHolder?: string;
}
