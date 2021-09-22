import { registerEnumType } from '@nestjs/graphql';

export enum OrderItemStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  VBANK_READY = 'VBANK_READY',
  VBANK_DODGED = 'VBANK_DODGED',
  PAID = 'PAID',
  SHIP_PENDING = 'SHIP_PENDING',
  /** 배송 줁비중. (발주 완료와 동일) */
  SHIP_READY = 'SHIP_READY',
  SHIPPING = 'SHIPPPING',
  SHIPPED = 'SHIPPED',
}
export const getOrderItemStatusDisplayName = (status: OrderItemStatus) => {
  if (!status) {
    return;
  }

  const {
    PENDING,
    FAILED,
    VBANK_READY,
    VBANK_DODGED,
    PAID,
    SHIP_PENDING,
    SHIP_READY,
    SHIPPING,
    SHIPPED,
  } = OrderItemStatus;

  return (
    {
      [PENDING]: '결제 대기',
      [FAILED]: '결제 취소',
      [VBANK_READY]: '입금 대기',
      [VBANK_DODGED]: '입금 전 취소',
      [PAID]: '결제 완료',
      [SHIP_PENDING]: '배송 예약중',
      [SHIP_READY]: '배송 준비중',
      [SHIPPING]: '배송중',
      [SHIPPED]: '배송 완료',
    }[status] || status
  );
};

registerEnumType(OrderItemStatus, {
  name: 'OrderItemStatus',
  description: '주문상품 상태입니다. 클레임상태와 무관하게 handling됩니다.',
});

export enum OrderItemClaimStatus {
  CANCEL_REQUESTED = 'CANCEL_REQUESTED',
  CANCELLED = 'CANCELLED',
  EXCHANGE_REQUESTED = 'EXCHANGE_REQUESTED',
  EXCHANGED = 'EXCHANGED',
  REFUND_REQUESTED = 'REFUND_REQUESTED',
  REFUNDED = 'REFUNDED',
}
export const getOrderItemClaimStatusDisplayName = (
  claimStatus: OrderItemClaimStatus
) => {
  if (!claimStatus) {
    return;
  }

  const {
    CANCEL_REQUESTED,
    CANCELLED,
    EXCHANGE_REQUESTED,
    EXCHANGED,
    REFUND_REQUESTED,
    REFUNDED,
  } = OrderItemClaimStatus;

  return (
    {
      [CANCEL_REQUESTED]: '취소 신청',
      [CANCELLED]: '취소 완료',
      [EXCHANGE_REQUESTED]: '교환 신청',
      [EXCHANGED]: '교환 완료',
      [REFUND_REQUESTED]: '반품 신청',
      [REFUNDED]: '반품 완료',
    }[claimStatus] || claimStatus
  );
};

registerEnumType(OrderItemClaimStatus, {
  name: 'OrderItemClaimStatus',
  description: '주문상품 클레임상태입니다.',
});
