import { BankCode } from '@common/constants';

import {
  PaymentStatus,
  PayMethod,
  PayEnviroment,
  Pg,
  CardCode,
} from '../constants';
import { IPaymentCancellation } from './payment-cancellation.interface';

export interface IPayment {
  /** 고유 주문번호 (PK) */
  merchantUid: string;
  createdAt: Date;
  updatedAt: Date;

  status: PaymentStatus;
  env: PayEnviroment;
  /** 결제 origin (ex: https://pickk.one/orders/sheet) */
  origin: string;
  pg: Pg;
  /** pg사 고유 거래번호 */
  pgTid: string;
  payMethod: PayMethod;
  /** 주문명 */
  name: string;
  /** 거래 금액 */
  amount: number;
  buyerName: string;
  buyerTel: string;
  buyerEmail: string;
  buyerAddr: string;
  buyerPostalcode: string;
  /** 카드사 거래 번호 */
  applyNum?: string;
  /** 카드사 코드 */
  cardCode?: CardCode;
  /** 카드 번호 */
  cardNum?: string;
  vbankCode?: BankCode;
  vbankName?: string;
  vbankNum?: string;
  vbankHolder?: string;
  vbankDate?: string;
  cancellations?: IPaymentCancellation[];
  failedReason?: string;
  failedAt?: Date;
  vbankReadyAt?: Date;
  paidAt?: Date;
  cancelledAt?: Date;
}
