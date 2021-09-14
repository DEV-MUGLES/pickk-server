import { getEnumValues } from '@common/helpers';

import { OrderItemClaimStatus, OrderItemStatus } from '../constants';
import { OrderItem } from '../models';

export abstract class OrderItemProcessStrategy {
  abstract status: OrderItemStatus | OrderItemClaimStatus;
  abstract statusChangedField: keyof Pick<
    OrderItem,
    | 'failedAt'
    | 'vbankReadyAt'
    | 'vbankDodgedAt'
    | 'paidAt'
    | 'shipReadyAt'
    | 'shippingAt'
    | 'shippedAt'
    | 'cancelledAt'
    | 'refundRequestedAt'
    | 'exchangeRequestedAt'
  >;

  constructor(protected orderItem: OrderItem) {}

  protected abstract validate(): void;

  public execute() {
    this.validate();

    if (getEnumValues(OrderItemStatus).includes(this.status)) {
      this.orderItem.status = this.status as OrderItemStatus;
    } else {
      this.orderItem.claimStatus = this.status as OrderItemClaimStatus;
    }
    this.orderItem[this.statusChangedField] = new Date();
  }
}
