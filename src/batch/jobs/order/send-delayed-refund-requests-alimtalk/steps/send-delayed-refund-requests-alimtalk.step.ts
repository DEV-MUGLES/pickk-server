import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { JobExecutionContext } from '@batch/models';
import { allSettled, isRejected, RejectResponse } from '@common/helpers';
import { AlimtalkService } from '@providers/sens';
import { RefundRequestsRepository } from '@order/refund-requests/refund-requests.repository';
import { RefundRequestStatus } from '@order/refund-requests/constants';

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
    const delayedRefundRequestsRawDatas = await this.refundRequestsRepository
      .createQueryBuilder('refundRequest')
      .select('count(*), sellerId')
      .leftJoinAndSelect('refundRequest.seller', 'seller')
      .leftJoinAndSelect('seller.brand', 'brand')
      .where('refundRequest.isProcessDelaying = true')
      .andWhere('refundRequest.status != :status', {
        status: RefundRequestStatus.CONFIRMED,
      })
      .groupBy('refundRequest.sellerId')
      .getRawMany();

    const settledSendDatas = await allSettled(
      delayedRefundRequestsRawDatas.map(
        (r) =>
          new Promise(async (resolve, reject) => {
            const brandKor = r.brand_nameKor;
            const delayedCount = r['count(*)'];
            const phoneNumber = r.seller_phoneNumber;
            try {
              await this.alimtalkService.sendDelayedExchangeRequests(
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
