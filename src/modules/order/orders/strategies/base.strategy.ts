import { OrderStatus } from '../constants';
import { Order } from '../models';

export abstract class OrderProcessStrategy {
  abstract status?: OrderStatus;
  abstract statusChangedField?: keyof Pick<
    Order,
    'payingAt' | 'failedAt' | 'vbankReadyAt' | 'vbankDodgedAt' | 'paidAt'
  >;

  constructor(protected order: Order) {}

  protected abstract validate(): void;

  public execute() {
    this.validate();

    if (this.status) {
      this.order.status = this.status as OrderStatus;
      this.order[this.statusChangedField] = new Date();
    }
  }
}
