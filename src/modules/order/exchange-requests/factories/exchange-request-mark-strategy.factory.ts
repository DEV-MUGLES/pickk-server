import { InternalServerErrorException } from '@nestjs/common';

import { ExchangeRequestStatus } from '../constants';
import { ExchangeRequest } from '../models';
import {
  ExchangeRequestMarkStrategy,
  ExchangeRequestPickedStrategy,
  ExchangeRequestReshippingStrategy,
  ExchangeRequestReshippedStrategy,
  ExchangeRequestRequestedStrategy,
  ExchangeRequestConvertedStrategy,
  ExchangeRequestCanceledStrategy,
} from '../strategies';

const { Requested, Picked, Canceled, Reshipping, Reshipped, Converted } =
  ExchangeRequestStatus;

export class ExchangeRequestMarkStrategyFactory {
  static from(
    status: ExchangeRequestStatus,
    exchangeRequest: ExchangeRequest
  ): ExchangeRequestMarkStrategy {
    switch (status) {
      case Requested:
        return new ExchangeRequestRequestedStrategy(exchangeRequest);
      case Picked:
        return new ExchangeRequestPickedStrategy(exchangeRequest);
      case Canceled:
        return new ExchangeRequestCanceledStrategy(exchangeRequest);
      case Reshipping:
        return new ExchangeRequestReshippingStrategy(exchangeRequest);
      case Reshipped:
        return new ExchangeRequestReshippedStrategy(exchangeRequest);
      case Converted:
        return new ExchangeRequestConvertedStrategy(exchangeRequest);

      default:
        throw new InternalServerErrorException(
          'Invalid ExchangeRequestStatus to mark'
        );
    }
  }
}
