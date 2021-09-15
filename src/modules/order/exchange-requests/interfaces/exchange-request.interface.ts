import { IProduct } from '@item/products/interfaces';
import { ISeller } from '@item/sellers/interfaces';
import { IOrderItem } from '@order/order-items/interfaces';
import { OrderClaimFaultOf } from '@order/refund-requests/constants';
import { IShipment } from '@order/shipments/interfaces';
import { IUser } from '@user/users/interfaces';

import { ExchangeRequestStatus } from '../constants';

export interface IExchangeRequest {
  merchantUid: string;

  user?: IUser;
  userId?: number;
  product?: IProduct;
  productId?: number;
  seller?: ISeller;
  sellerId?: number;

  pickShipment: IShipment;
  pickShipmentId: number;
  reShipment: IShipment;
  reShipmentId: number;

  orderItem: IOrderItem;
  orderItemMerchantUid: string;

  status: ExchangeRequestStatus;
  faultOf: OrderClaimFaultOf;
  reason: string;
  rejectReason: string;

  /** 결제된 교환 배송비 */
  shippingFee: number;

  quantity: number;
  itemName: string;
  /** 옵션명?입니다. (ex: "검정 / S")
   * product entity에 field로 존재하진 않습니다. */
  productVariantName: string;

  isProcessDelaying: boolean;

  /** createdAt과 같다. */
  processDelayedAt: Date;

  /** createdAt과 같다. */
  requestedAt: Date;
  pickedAt: Date;
  reshippingAt: Date;
  reshippedAt: Date;
  rejectedAt: Date;
}
