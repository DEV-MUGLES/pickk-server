import { RefundRequestStatus } from '../constants';
import { RefundRequest } from '../models';

export abstract class RefundRequestMarkStrategy {
  abstract status: RefundRequestStatus;
  abstract statusChangedField: keyof Pick<
    RefundRequest,
    'pickedAt' | 'confirmedAt'
  >;

  constructor(protected refundRequest: RefundRequest) {}

  protected abstract validate(): void;

  public execute() {
    this.validate();

    this.refundRequest.status = this.status as RefundRequestStatus;
    this.refundRequest[this.statusChangedField] = new Date();
  }
}
