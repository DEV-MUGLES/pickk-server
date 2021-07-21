import { registerEnumType } from '@nestjs/graphql';

export enum OrderItemStatus {
  Pending = 'pending',
  Paying = 'paying',
  Failed = 'failed',
  VbankReady = 'vbank_ready',
  Paid = 'paid',
  Withdrawn = 'withdrawn',
  ShipPending = 'ship_pending',
  /** 배송 줁비중. (발주 완료와 동일) */
  ShipReady = 'ship_ready',
  Shipping = 'shipping',
  Shipped = 'shipped',
}

registerEnumType(OrderItemStatus, {
  name: 'OrderItemStatus',
  description: '주문상품 상태입니다. 클레임상태와 무관하게 handling됩니다.',
});

export enum OrderItemClaimStatus {
  CancelRequested = 'cancel_requested',
  Cancelled = 'cancelled',
  ExchangeRequested = 'exchange_requested',
  Exchanged = 'exchanged',
  RefundRequested = 'refund_requested',
  Refunded = 'refunded',
}

registerEnumType(OrderItemClaimStatus, {
  name: 'OrderItemClaimStatus',
  description: '주문상품 클레임상태입니다.',
});
