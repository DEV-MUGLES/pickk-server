import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { In, LessThan } from 'typeorm';

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
      where: [
        {
          status: RefundRequestStatus.Requested,
          requestedAt: LessThan(dayjs().subtract(5, 'day').toDate()),
          isProcessDelaying: false,
        },
        {
          status: RefundRequestStatus.Picked,
          pickedAt: LessThan(dayjs().subtract(5, 'day').toDate()),
          isProcessDelaying: false,
        },
      ],
    });

    delayedRefundRequests.forEach((v) => {
      v.isProcessDelaying = true;
    });

    const processedRefundRequests = await this.refundRequestsRepository.find({
      status: In([RefundRequestStatus.Confirmed, RefundRequestStatus.Rejected]),
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
