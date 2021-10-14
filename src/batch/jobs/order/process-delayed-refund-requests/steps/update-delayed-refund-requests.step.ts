import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { LessThan, Not } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { RefundRequestsRepository } from '@order/refund-requests/refund-requests.repository';
import { RefundRequestStatus } from '@order/refund-requests/constants';

@Injectable()
export class UpdateDelayedRefundRequestsStep extends BaseStep {
  constructor(
    private readonly refundRequestsRepository: RefundRequestsRepository
  ) {
    super();
  }

  async tasklet() {
    const delayedRefundRequests = await this.refundRequestsRepository.find({
      status: RefundRequestStatus.Requested,
      requestedAt: LessThan(dayjs().subtract(5, 'day').toDate()),
    });

    delayedRefundRequests.forEach((v) => {
      v.isProcessDelaying = true;
    });

    const processedRefundRequests = await this.refundRequestsRepository.find({
      status: Not(RefundRequestStatus.Requested),
      isProcessDelaying: true,
    });

    processedRefundRequests.forEach((v) => {
      v.isProcessDelaying = false;
    });

    await this.refundRequestsRepository.save([
      ...delayedRefundRequests,
      ...processedRefundRequests,
    ]);
  }
}
