import { InternalServerErrorException } from '@nestjs/common';

import { ExchangeRequestStatus } from '../constants';
import { ExchangeRequest } from '../models';
import {
  ExchangeRequestMarkStrategy,
  ExchangeRequestPickedStrategy,
  ExchangeRequestReshippingStrategy,
  ExchangeRequestReshippedStrategy,
  ExchangeRequestRequestedStrategy,
} from '../strategies';

const { Requested, Picked, Reshipping, Reshipped } = ExchangeRequestStatus;

export class ExchangeRequestMarkStrategyFactory {
  static from(
    status: ExchangeRequestStatus,
    ExchangeRequest: ExchangeRequest
  ): ExchangeRequestMarkStrategy {
    switch (status) {
      case Requested:
        return new ExchangeRequestRequestedStrategy(ExchangeRequest);
      case Picked:
        return new ExchangeRequestPickedStrategy(ExchangeRequest);
      case Reshipping:
        return new ExchangeRequestReshippingStrategy(ExchangeRequest);
      case Reshipped:
        return new ExchangeRequestReshippedStrategy(ExchangeRequest);

      default:
        throw new InternalServerErrorException(
          'Invalide ExchangeRequestStatus to mark'
        );
    }
  }
}
