import { ISeller } from '@item/sellers/interfaces';
import { IOrderItem } from '@order/order-items/interfaces';
import { IOrder } from '@order/orders/interfaces';
import { IUser } from '@user/users/interfaces';

import { OrderClaimFaultOf, RefundRequestStatus } from '../constants';

export interface IRefundRequest {
  id: number;

  user?: IUser;
  userId?: number;
  order: IOrder;
  orderMerchantUid: string;
  seller?: ISeller;
  sellerId?: number;

  orderItems: IOrderItem[];

  status: RefundRequestStatus;
  faultOf: OrderClaimFaultOf;
  reason: string;
  amount: number;

  rejectReason: string;

  requestedAt: Date;
  /** 수거완료 시점 */
  pickedAt: Date;
  rejectedAt: Date;
  confirmedAt: Date;
}
