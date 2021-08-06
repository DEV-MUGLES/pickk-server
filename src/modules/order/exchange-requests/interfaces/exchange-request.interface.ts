import { IProduct } from '@item/products/interfaces';
import { IOrderItem } from '@order/order-items/interfaces';
import { OrderClaimFaultOf } from '@order/refund-requests/constants';
import { IUser } from '@user/users/interfaces';

import { ExchangeRequestStatus } from '../constants';

export interface IExchangeRequest {
  id: number;

  user?: IUser;
  userId?: number;
  product?: IProduct;
  productId?: number;

  orderItem: IOrderItem;
  orderItemMerchantUid: string;

  status: ExchangeRequestStatus;

  faultOf: OrderClaimFaultOf;
  reason: string;
  rejectReason: string;

  quantity: number;
  itemName: string;
  /** 옵션명?입니다. (ex: "검정 / S")
   * product entity에 field로 존재하진 않습니다. */
  productVariantName: string;

  /** createdAt과 같다. */
  requestedAt: Date;
  pickedAt: Date;
  reshippingAt: Date;
  reshippedAt: Date;
  rejectedAt: Date;
}
