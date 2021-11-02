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
  ExchangeRequestRejectedStrategy,
} from '../strategies';

const {
  Requested,
  Picked,
  Rejected,
  Reshipping,
  Reshipped,
  Converted,
} = ExchangeRequestStatus;

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
      case Rejected:
        return new ExchangeRequestRejectedStrategy(exchangeRequest);
      case Reshipping:
        return new ExchangeRequestReshippingStrategy(exchangeRequest);
      case Reshipped:
        return new ExchangeRequestReshippedStrategy(exchangeRequest);
      case Converted:
        return new ExchangeRequestConvertedStrategy(exchangeRequest);

      default:
        throw new InternalServerErrorException(
          'Invalide ExchangeRequestStatus to mark'
        );
    }
  }
}
