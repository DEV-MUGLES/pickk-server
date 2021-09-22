import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { JobExecutionContext } from '@batch/models';
import { allSettled, RejectResponse, isRejected } from '@common/helpers';
import { AlimtalkService } from '@providers/sens';
import { ExchangeRequestsRepository } from '@order/exchange-requests/exchange-requests.repository';
import { ExchangeRequestStatus } from '@order/exchange-requests/constants';

@Injectable()
export class SendDelayedExchangeRequestsAlimtalkStep extends BaseStep {
  constructor(
    private readonly alimtalkService: AlimtalkService,
    @InjectRepository(ExchangeRequestsRepository)
    private readonly exchangeRequestsRepository: ExchangeRequestsRepository
  ) {
    super();
  }

  async tasklet(context: JobExecutionContext) {
    const delayedExchangeRequestsRawDatas =
      await this.exchangeRequestsRepository
        .createQueryBuilder('exchangeRequest')
        .select('count(*), sellerId')
        .leftJoinAndSelect('exchangeRequest.seller', 'seller')
        .leftJoinAndSelect('seller.brand', 'brand')
        .where('exchangeRequest.isProcessDelaying = true')
        .andWhere('exchangeRequest.status IN (:...status)', {
          status: [
            ExchangeRequestStatus.Picked,
            ExchangeRequestStatus.Requested,
          ],
        })
        .groupBy('exchangeRequest.sellerId')
        .getRawMany();

    const settledSendDatas = await allSettled(
      delayedExchangeRequestsRawDatas.map(
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
        .filter(isRejected)
        .map((data) => (data as RejectResponse).reason)
    );

    if (rejectedSendDatas.length > 0) {
      context.put('failedBrands', rejectedSendDatas);
    } else {
      context.put('successBrandCounts', settledSendDatas.length);
    }
  }
}
