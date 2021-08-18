import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { JobExecutionContext } from '@batch/models';
import { allSettled, isRejected, RejectResponse } from '@common/helpers';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';
import { OrderItemStatus } from '@order/order-items/constants';
import { AlimtalkService } from '@providers/sens';

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
    const delayedOrderItemsRawDatas = await this.orderItemsRepository
      .createQueryBuilder('orderItem')
      .select('count(*), sellerId')
      .leftJoinAndSelect('orderItem.seller', 'seller')
      .leftJoinAndSelect('seller.brand', 'brand')
      .where('orderItem.isProcessDelaying = true')
      .andWhere('orderItem.status IN (:...status)', {
        status: [
          OrderItemStatus.Paid,
          OrderItemStatus.ShipReady,
          OrderItemStatus.ShipPending,
        ],
      })
      .groupBy('orderItem.sellerId')
      .getRawMany();

    const settledSendDatas = await allSettled(
      delayedOrderItemsRawDatas.map(
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
