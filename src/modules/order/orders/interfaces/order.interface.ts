import { IAccount } from '@common/interfaces';
import { IOrderItem } from '@order/order-items/interfaces';
import { PayMethod } from '@payment/payments/constants';
import { IUser } from '@user/users/interfaces';

import { OrderStatus } from '../constants';

import { IOrderBuyer } from './order-buyer.interface';
import { IOrderReceiver } from './order-receiver.interface';
import { IOrderVbankReceipt } from './order-vbank-receipt.interface';

export interface IOrder {
  merchantUid: string;
  createdAt: Date;
  updatedAt: Date;

  user?: IUser;
  userId?: number;
  orderItems: IOrderItem[];

  status: OrderStatus;
  payMethod?: PayMethod;

  /** 총 상품 가격 */
  totalItemFinalPrice: number;
  /** 총 배송비 */
  totalShippingFee: number;
  /** 총 쿠폰 할인 액수 */
  totalCouponDiscountAmount: number;
  /** 사용된 포인트 액수 (사용자가 입력한 usedPointAmount와 동일) */
  totalUsedPointAmount: number;
  /** 총 결제 금액 */
  totalPayAmount: number;

  // 가상계좌 관련 정보
  vbankInfo?: IOrderVbankReceipt;
  // 구매자 정보
  buyer?: IOrderBuyer;
  // 수령인 정보
  receiver?: IOrderReceiver;
  refundAccount?: IAccount;

  payingAt?: Date;
  failedAt?: Date;
  vbankReadyAt?: Date;
  vbankDodgedAt?: Date;
  paidAt?: Date;
  withdrawnAt?: Date;
}
