import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { JobExecutionContext } from '@batch/models';
import { allSettled, RejectResponse, isRejected } from '@common/helpers';
import { AlimtalkService } from '@providers/sens';

import { ExchangeRequestsRepository } from '@order/exchange-requests/exchange-requests.repository';
import { ExchangeRequestStatus } from '@order/exchange-requests/constants';

import { getDelayedCountDatas } from '../../helpers';

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
    const delayedExchangeRequests = await this.exchangeRequestsRepository.find({
      relations: ['seller', 'seller.brand'],
      where: {
        status: In([
          ExchangeRequestStatus.Picked,
          ExchangeRequestStatus.Requested,
        ]),
        isProcessDelaying: true,
      },
    });

    const settledSendDatas = await allSettled(
      getDelayedCountDatas(delayedExchangeRequests).map(
        ({ brandKor, phoneNumber, delayedCount }) =>
          new Promise(async (resolve, reject) => {
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
