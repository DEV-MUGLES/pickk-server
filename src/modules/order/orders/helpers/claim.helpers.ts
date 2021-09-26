import { OrderItem } from '@order/order-items/models';
import { OrderClaimFaultOf } from '@order/refund-requests/constants';

export const calcClaimShippingFee = (
  orderItems: OrderItem[],
  faultOf: OrderClaimFaultOf
) => {
  const { claimPolicy, shippingPolicy } = orderItems[0].seller;
  const { minimumAmountForFree } = shippingPolicy;

  const totalItemFinalPrice = orderItems.reduce(
    (sum, oi) => sum + oi.itemFinalPrice,
    0
  );
  const isFreeShipped = totalItemFinalPrice >= minimumAmountForFree;

  return faultOf === OrderClaimFaultOf.Seller
    ? 0
    : isFreeShipped
    ? claimPolicy.fee + shippingPolicy.fee
    : claimPolicy.fee;
};

/** 대상 주문상품의 결제금액의 합산입니다. 반품 배송비가 계산되지 않은 상태입니다. */
export const calcClaimAmount = (orderItems: OrderItem[]) => {
  return orderItems.reduce((sum, oi) => sum + oi.payAmount - oi.shippingFee, 0);
};
