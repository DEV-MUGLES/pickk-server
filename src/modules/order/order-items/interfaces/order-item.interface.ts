import { ContentType } from '@common/constants';
import { ICourier } from '@item/couriers/interfaces';
import { IItem } from '@item/items/interfaces';
import { IProduct } from '@item/products/interfaces';
import { ISeller } from '@item/sellers/interfaces';
import { IOrder } from '@order/orders/interfaces';
import { IUser } from '@user/users/interfaces';

import { OrderItemStatus, OrderItemClaimStatus } from '../constants';

export interface IOrderItem {
  merchantUid: string;
  createdAt: Date;
  updatedAt: Date;

  user?: IUser;
  userId?: number;
  seller?: ISeller;
  sellerId?: number;
  item?: IItem;
  itemId?: number;
  product?: IProduct;
  productId?: number;

  order: IOrder;
  orderMerchantUid: number;

  status: OrderItemStatus;
  claimStatus?: OrderItemClaimStatus;
  quantity: number;

  isConfirmed: boolean;
  isSettled: boolean;

  itemFinalPrice: number;
  couponDiscountAmount: number;
  /** 사용자가 입력한 usedPointAmount를 액수에 따라 가중 평균낸 값 */
  usedPointAmount: number;
  payAmount: number;

  // 상품 관련 정보
  brandNameKor: string;
  itemName: string;
  /** 옵션명?입니다. (ex: "검정 / S")
   * product entity에 field로 존재하진 않습니다. */
  productVariantName: string;

  // 추천인 관련 정보
  recommenderId?: number;
  recommenderNickname?: string;

  // 추천 컨텐츠 관련 정보
  recommendContentType?: ContentType;
  recommendContentItemId?: number;

  // 배송 정보
  courier?: ICourier;
  courierId?: number;
  trackCode?: string;

  // 상태 변경 시점 값들
  paidAt?: Date;
  withdrawnAt?: Date;
  shipReadyAt?: Date;
  shippingAt?: Date;
  shippedAt?: Date;

  // 클레임 상태 변경 시점 값들
  cancelRequestedAt?: Date;
  cancelledAt?: Date;
  exchangeRequestedAt?: Date;
  exchangedAt?: Date;
  refundRequestedAt?: Date;
  refundedAt?: Date;

  /** 예약발송 예정일 */
  shipReservedAt?: Date;
  confirmedAt?: Date;
  /** 정산된 시점 */
  settledAt?: Date;
}