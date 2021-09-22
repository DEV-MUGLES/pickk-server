import { InternalServerErrorException } from '@nestjs/common';

import { ExchangeRequestStatus } from '../constants';
import { ExchangeRequest } from '../models';
import {
  ExchangeRequestMarkStrategy,
  ExchangeRequestPickedStrategy,
  ExchangeRequestReshippingStrategy,
  ExchangeRequestReshippedStrategy,
} from '../strategies';

const { PICKED, RESHIPPING, RESHIPPED } = ExchangeRequestStatus;

export class ExchangeRequestMarkStrategyFactory {
  static from(
    status: ExchangeRequestStatus,
    ExchangeRequest: ExchangeRequest
  ): ExchangeRequestMarkStrategy {
    switch (status) {
      case PICKED:
        return new ExchangeRequestPickedStrategy(ExchangeRequest);
      case RESHIPPING:
        return new ExchangeRequestReshippingStrategy(ExchangeRequest);
      case RESHIPPED:
        return new ExchangeRequestReshippedStrategy(ExchangeRequest);

      default:
        throw new InternalServerErrorException(
          'Invalide ExchangeRequestStatus to mark'
        );
    }
  }
}
