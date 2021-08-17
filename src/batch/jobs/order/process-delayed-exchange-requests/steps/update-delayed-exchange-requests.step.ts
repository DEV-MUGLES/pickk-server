import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { LessThan } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { ExchangeRequestsRepository } from '@order/exchange-requests/exchange-requests.repository';

@Injectable()
export class UpdateDelayedExchangeRequestsStep extends BaseStep {
  constructor(
    private readonly exchangeRequestsRepository: ExchangeRequestsRepository
  ) {
    super();
  }

  async tasklet() {
    const delayedExchangeRequests = await this.exchangeRequestsRepository.find({
      requestedAt: LessThan(dayjs().add(-5, 'day').toDate()),
    });

    delayedExchangeRequests.forEach((d) => {
      d.isProcessDelaying = true;
    });

    await this.exchangeRequestsRepository.save(delayedExchangeRequests);
  }
}
