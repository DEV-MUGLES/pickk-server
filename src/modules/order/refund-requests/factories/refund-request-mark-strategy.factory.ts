import { InternalServerErrorException } from '@nestjs/common';

import { RefundRequestStatus } from '../constants';
import { RefundRequest } from '../models';
import {
  RefundRequestMarkStrategy,
  RefundRequestPickedStrategy,
  RefundRequestConfirmedStrategy,
} from '../strategies';

const { Picked, Confirmed } = RefundRequestStatus;

export class RefundRequestMarkStrategyFactory {
  static from(
    status: RefundRequestStatus,
    refundRequest: RefundRequest
  ): RefundRequestMarkStrategy {
    switch (status) {
      case Picked:
        return new RefundRequestPickedStrategy(refundRequest);
      case Confirmed:
        return new RefundRequestConfirmedStrategy(refundRequest);

      default:
        throw new InternalServerErrorException(
          'Invalide RefundRequestStatus to mark'
        );
    }
  }
}
