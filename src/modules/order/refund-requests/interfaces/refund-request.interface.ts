import { IOrderItem } from '@order/order-items/interfaces';
import { IOrder } from '@order/orders/interfaces';

import { RefundRequestFaultOf, RefundRequestStatus } from '../constants';

export interface IRefundRequest {
  status: RefundRequestStatus;

  order: IOrder;
  orderMerchantUid: string;

  orderItems: IOrderItem[];

  faultOf: RefundRequestFaultOf;
  reason: string;
  amount: number;

  rejectReasons: string;

  requestedAt: Date;
  /** 수거완료 시점 */
  pickedAt: Date;
  rejectedAt: Date;
  confirmedAt: Date;
}
