import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { JobExecutionContext } from '@batch/models';
import { allSettled, isRejected, RejectResponse } from '@common/helpers';
import { AlimtalkService } from '@providers/sens';

import { OrderItemsRepository } from '@order/order-items/order-items.repository';
import { OrderItemStatus } from '@order/order-items/constants';

import { getDelayedCountDatas } from '../../helpers';

@Injectable()
export class SendDelayedOrderItemsAlimtalkStep extends BaseStep {
  constructor(
    private readonly alimtalkService: AlimtalkService,
    @InjectRepository(OrderItemsRepository)
    private readonly orderItemsRepository: OrderItemsRepository
  ) {
    super();
  }

  async tasklet(context: JobExecutionContext) {
    const delayedOrderItems = await this.orderItemsRepository.find({
      relations: ['seller', 'seller.brand'],
      where: {
        status: In([
          OrderItemStatus.Paid,
          OrderItemStatus.ShipReady,
          OrderItemStatus.ShipPending,
        ]),
        isProcessDelaying: true,
      },
    });

    const settledSendDatas = await allSettled(
      getDelayedCountDatas(delayedOrderItems).map(
        ({ brandKor, phoneNumber, delayedCount }) =>
          new Promise(async (resolve, reject) => {
            try {
              await this.alimtalkService.sendDelayedOrderItems(
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
