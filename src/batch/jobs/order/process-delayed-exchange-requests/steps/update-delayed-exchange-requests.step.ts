import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { In, LessThan } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { ExchangeRequestsRepository } from '@order/exchange-requests/exchange-requests.repository';
import { ExchangeRequestStatus } from '@order/exchange-requests/constants';

@Injectable()
export class UpdateDelayedExchangeRequestsStep extends BaseStep {
  constructor(
    private readonly exchangeRequestsRepository: ExchangeRequestsRepository
  ) {
    super();
  }

  async tasklet() {
    const delayedExchangeRequests = await this.exchangeRequestsRepository.find({
      where: [
        {
          status: ExchangeRequestStatus.Requested,
          requestedAt: LessThan(dayjs().subtract(5, 'day').toDate()),
          isProcessDelaying: false,
        },
        {
          status: ExchangeRequestStatus.Picked,
          pickedAt: LessThan(dayjs().subtract(5, 'day').toDate()),
          isProcessDelaying: false,
        },
      ],
    });
    delayedExchangeRequests.forEach((v) => {
      v.isProcessDelaying = true;
    });

    const processedExchangeRequests =
      await this.exchangeRequestsRepository.find({
        isProcessDelaying: true,
        status: In([
          ExchangeRequestStatus.Rejected,
          ExchangeRequestStatus.Reshipped,
          ExchangeRequestStatus.Reshipping,
        ]),
      });
    processedExchangeRequests.forEach((v) => {
      v.isProcessDelaying = false;
    });

    await this.exchangeRequestsRepository.save([
      ...delayedExchangeRequests,
      ...processedExchangeRequests,
    ]);
  }
}
