import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { LessThan } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';

import { RefundRequestsRepository } from '@order/refund-requests/refund-requests.repository';

@Injectable()
export class UpdateDelayedRefundRequestsStep extends BaseStep {
  constructor(
    private readonly refundRequestsRepository: RefundRequestsRepository
  ) {
    super();
  }

  async tasklet() {
    const delayedRefundRequests = await this.refundRequestsRepository.find({
      requestedAt: LessThan(dayjs().add(-5, 'day').toDate()),
    });

    delayedRefundRequests.forEach((d) => {
      d.isProcessDelaying = true;
    });

    await this.refundRequestsRepository.save(delayedRefundRequests);
  }
}
