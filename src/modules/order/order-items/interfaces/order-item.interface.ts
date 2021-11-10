import { IDigest } from '@content/digests/interfaces';
import { ICampaign } from '@item/campaigns/interfaces';
import { IItem } from '@item/items/interfaces';
import { IProduct } from '@item/products/interfaces';
import { ISeller } from '@item/sellers/interfaces';
import { ICoupon } from '@order/coupons/interfaces';
import { IExchangeRequest } from '@order/exchange-requests/interfaces';
import { IOrder } from '@order/orders/interfaces';
import { IRefundRequest } from '@order/refund-requests/interfaces';
import { IShipment } from '@order/shipments/interfaces';
import { IUser } from '@user/users/interfaces';

import {
  OrderItemStatus,
  OrderItemClaimStatus,
  OrderItemSettleStatus,
} from '../constants';

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
  usedCoupon?: ICoupon;
  usedCouponId?: number;

  campaign: ICampaign;
  campaignId: number;

  order: IOrder;
  orderMerchantUid: string;

  shipment: IShipment;
  shipmentId: number;
  refundRequest: IRefundRequest;
  exchangeRequest: IExchangeRequest;

  status: OrderItemStatus;
  claimStatus?: OrderItemClaimStatus;
  settleStatus: OrderItemSettleStatus;
  quantity: number;

  isShipReserved: boolean;
  isConfirmed: boolean;
  isSettled: boolean;
  /** 발송 지연. 스토어 어드민에서 담당자가 직접 설정하는 값. */
  isDelaying: boolean;
  /** 처리 지연. 오래된 주문상품건에 대해서 batch 작업으로 자동으로 설정하는 값. */
  isProcessDelaying: boolean;
  /** 구매시 무료배송처리되었는가 */
  isFreeShippingPackage: boolean;

  itemSellPrice: number;
  itemFinalPrice: number;
  productPriceVariant: number;
  shippingFee: number;
  couponDiscountAmount: number;
  /** 사용자가 입력한 usedPointAmount를 액수에 따라 가중 평균낸 값 */
  usedPointAmount: number;
  settleAmount: number;

  usedCouponName?: string;

  // 상품 관련 정보
  brandNameKor: string;
  itemName: string;
  /** 옵션명?입니다. (ex: "검정 / S")
   * product entity에 field로 존재하진 않습니다. */
  productVariantName: string;

  // 추천인 관련 정보
  recommenderId?: number;
  recommenderNickname?: string;

  // 추천 Digest 관련 정보
  recommendDigest: IDigest;
  recommendDigestId: number;

  // 상태 변경 시점 값들
  failedAt?: Date;
  vbankReadyAt?: Date;
  vbankDodgedAt?: Date;
  paidAt?: Date;
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

  /** 지연 발송으로 전환된 시점 */
  delayedAt: Date;
  /** 지연 발송 예정일 */
  delayedShipExpectedAt: Date;

  /** 처리 지연으로 전환된 시점 */
  processDelayedAt: Date;

  /** 예약발송 예정일 */
  shipReservedAt?: Date;
  confirmedAt?: Date;
  /** 정산된 시점 */
  settledAt?: Date;
}
