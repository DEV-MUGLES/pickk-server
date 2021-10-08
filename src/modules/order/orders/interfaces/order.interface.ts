import { IAccount } from '@common/interfaces';

import { IOrderItem } from '@order/order-items/interfaces';
import { IRefundRequest } from '@order/refund-requests/interfaces';
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

  // 가상계좌 관련 정보
  vbankReceipt?: IOrderVbankReceipt;
  // 구매자 정보
  buyer?: IOrderBuyer;
  // 수령인 정보
  receiver?: IOrderReceiver;
  refundAccount?: IAccount;

  refundRequests?: IRefundRequest[];

  status: OrderStatus;
  payMethod?: PayMethod;

  payingAt?: Date;
  failedAt?: Date;
  vbankReadyAt?: Date;
  vbankDodgedAt?: Date;
  paidAt?: Date;
}
