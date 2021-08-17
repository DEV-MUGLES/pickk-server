import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
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

  async tasklet() {
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

    delayedOrderItemsRawDatas.forEach(async (r) => {
      const delayedCount = r['count(*)'];
      const phoneNumber = r.seller_phoneNumber;
      const brandKor = r.brand_nameKor;

      await this.alimtalkService.sendDelayedOrderItems(
        { brandKor, phoneNumber },
        delayedCount
      );
    });
  }
}
