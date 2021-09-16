import { ExchangeRequestStatus } from '../constants';
import { ExchangeRequest } from '../models';

export abstract class ExchangeRequestMarkStrategy {
  abstract status: ExchangeRequestStatus;
  abstract statusChangedField: keyof Pick<
    ExchangeRequest,
    'pickedAt' | 'reshippingAt' | 'reshippedAt'
  >;

  constructor(protected exchangeRequest: ExchangeRequest) {}

  protected abstract validate(): void;

  public execute() {
    this.validate();

    this.exchangeRequest.status = this.status as ExchangeRequestStatus;
    this.exchangeRequest[this.statusChangedField] = new Date();
  }
}
