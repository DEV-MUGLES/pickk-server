import { registerEnumType } from '@nestjs/graphql';

export enum OrderItemStatus {
  Pending = 'Pending',
  Failed = 'Failed',
  VbankReady = 'VbankReady',
  VbankDodged = 'VbankDodged',
  Paid = 'Paid',
  ShipPending = 'ShipPending',
  /** 배송 줁비중. (발주 완료와 동일) */
  ShipReady = 'ShipReady',
  Shipping = 'Shipping',
  Shipped = 'Shipped',
}
export const getOrderItemStatusDisplayName = (status: OrderItemStatus) => {
  if (!status) {
    return;
  }

  const {
    Pending,
    Failed,
    VbankReady,
    VbankDodged,
    Paid,
    ShipPending,
    ShipReady,
    Shipping,
    Shipped,
  } = OrderItemStatus;

  return (
    {
      [Pending]: '결제 대기',
      [Failed]: '결제 취소',
      [VbankReady]: '입금 대기',
      [VbankDodged]: '입금 전 취소',
      [Paid]: '결제 완료',
      [ShipPending]: '배송 예약중',
      [ShipReady]: '배송 준비중',
      [Shipping]: '배송중',
      [Shipped]: '배송 완료',
    }[status] || status
  );
};

registerEnumType(OrderItemStatus, {
  name: 'OrderItemStatus',
  description: '주문상품 상태입니다. 클레임상태와 무관하게 handling됩니다.',
});

export enum OrderItemClaimStatus {
  CancelRequested = 'CancelRequested',
  Cancelled = 'Cancelled',
  ExchangeRequested = 'ExchangeRequested',
  Exchanged = 'Exchanged',
  RefundRequested = 'RefundRequested',
  Refunded = 'Refunded',
}
export const getOrderItemClaimStatusDisplayName = (
  claimStatus: OrderItemClaimStatus
) => {
  if (!claimStatus) {
    return;
  }

  const {
    CancelRequested,
    Cancelled,
    ExchangeRequested,
    Exchanged,
    RefundRequested,
    Refunded,
  } = OrderItemClaimStatus;

  return (
    {
      [CancelRequested]: '취소 신청',
      [Cancelled]: '취소 완료',
      [ExchangeRequested]: '교환 신청',
      [Exchanged]: '교환 완료',
      [RefundRequested]: '반품 신청',
      [Refunded]: '반품 완료',
    }[claimStatus] || claimStatus
  );
};

registerEnumType(OrderItemClaimStatus, {
  name: 'OrderItemClaimStatus',
  description: '주문상품 클레임상태입니다.',
});
