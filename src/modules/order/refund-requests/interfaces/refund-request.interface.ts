import { ISeller } from '@item/sellers/interfaces';
import { IOrderItem } from '@order/order-items/interfaces';
import { IOrder } from '@order/orders/interfaces';
import { IShipment } from '@order/shipments/interfaces';
import { IUser } from '@user/users/interfaces';

import { OrderClaimFaultOf, RefundRequestStatus } from '../constants';

export interface IRefundRequest {
  id: number;

  user?: IUser;
  userId?: number;
  seller?: ISeller;
  sellerId?: number;

  order: IOrder;
  orderMerchantUid: string;
  shipment: IShipment;
  shipmentId: number;
  orderItems: IOrderItem[];

  status: RefundRequestStatus;
  faultOf: OrderClaimFaultOf;
  reason: string;
  /** 환불될 금액 */
  amount: number;

  /** 부과된 반품 배송비 */
  shippingFee: number;

  rejectReason: string;

  isProcessDelaying: boolean;

  processDelayedAt: Date;

  requestedAt: Date;
  /** 수거완료 시점 */
  pickedAt: Date;
  rejectedAt: Date;
  confirmedAt: Date;
}
