import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
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

  async tasklet() {
    const delayedRefundRequestsRawDatas = await this.refundRequestsRepository
      .createQueryBuilder('refundRequest')
      .select('count(*), sellerId')
      .leftJoinAndSelect('refundRequest.seller', 'seller')
      .leftJoinAndSelect('seller.brand', 'brand')
      .where('refundRequest.isProcessDelaying = true')
      .andWhere('refundRequest.status NOT IN (:status)', {
        status: [RefundRequestStatus.Confirmed],
      })
      .groupBy('refundRequest.sellerId')
      .getRawMany();

    delayedRefundRequestsRawDatas.forEach(async (r) => {
      const brandKor = r.brand_nameKor;
      const delayedCount = r['count(*)'];
      const phoneNumber = r.seller_phoneNumber;

      await this.alimtalkService.sendDelayedRefundRequests(
        { brandKor, phoneNumber },
        delayedCount
      );
    });
  }
}
