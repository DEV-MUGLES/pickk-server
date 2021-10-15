import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { JobExecutionContext } from '@batch/models';
import { allSettled, isRejected, RejectResponse } from '@common/helpers';
import { AlimtalkService } from '@providers/sens';

import { RefundRequestsRepository } from '@order/refund-requests/refund-requests.repository';
import { RefundRequestStatus } from '@order/refund-requests/constants';

import { getDelayedCountDatas } from '../../helpers';

@Injectable()
export class SendDelayedRefundRequestsAlimtalkStep extends BaseStep {
  constructor(
    private readonly alimtalkService: AlimtalkService,
    @InjectRepository(RefundRequestsRepository)
    private readonly refundRequestsRepository: RefundRequestsRepository
  ) {
    super();
  }

  async tasklet(context: JobExecutionContext) {
    const delayedRefundRequests = await this.refundRequestsRepository.find({
      relations: ['seller', 'seller.brand'],
      where: {
        isProcessDelaying: true,
        status: In([RefundRequestStatus.Requested, RefundRequestStatus.Picked]),
      },
    });

    const settledSendDatas = await allSettled(
      getDelayedCountDatas(delayedRefundRequests).map(
        ({ brandKor, delayedCount, phoneNumber }) =>
          new Promise(async (resolve, reject) => {
            try {
              await this.alimtalkService.sendDelayedRefundRequests(
                { brandKor, phoneNumber },
                delayedCount
              );
              resolve({ brandKor, delayedCount });
            } catch (err) {
              reject(brandKor);
            }
          })
      )
    );

    const rejectedSendDatas = [].concat(
      ...settledSendDatas
        .filter((data) => isRejected(data))
        .map((data) => (data as RejectResponse).reason)
    );

    if (rejectedSendDatas.length > 0) {
      context.put('failedBrands', rejectedSendDatas);
    } else {
      context.put('successBrandCounts', settledSendDatas.length);
    }
  }
}
