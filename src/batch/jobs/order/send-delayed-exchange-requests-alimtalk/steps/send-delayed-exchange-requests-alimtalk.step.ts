import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
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

  async tasklet() {
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

    delayedExchangeRequestsRawDatas.forEach(async (r) => {
      const brandKor = r.brand_nameKor;
      const delayedCount = r['count(*)'];
      const phoneNumber = r.seller_phoneNumber;

      await this.alimtalkService.sendDelayedExchangeRequests(
        { brandKor, phoneNumber },
        delayedCount
      );
    });
  }
}
