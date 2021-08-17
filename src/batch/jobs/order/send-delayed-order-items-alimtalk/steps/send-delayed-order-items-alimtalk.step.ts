import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets } from 'typeorm';

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
      .select('count(*), sellerId, brandNameKor')
      .leftJoinAndSelect('orderItem.seller', 'seller')
      .where('orderItem.isProcessDelaying = true')
      .andWhere(
        new Brackets((qb) => {
          qb.where('orderItem.status = :paid', {
            paid: OrderItemStatus.Paid,
          })
            .orWhere('orderItem.status = :shipReady', {
              shipReady: OrderItemStatus.ShipReady,
            })
            .orWhere('orderItem.status = :shipPending', {
              shipPending: OrderItemStatus.ShipPending,
            });
        })
      )
      .groupBy('orderItem.sellerId')
      .addGroupBy('orderItem.brandNameKor')
      .getRawMany();

    delayedOrderItemsRawDatas.forEach(async (r) => {
      const delayedCount = r['count(*)'];
      const phoneNumber = r.seller_phoneNumber;
      const brandKor = r.brandNameKor;

      await this.alimtalkService.sendDelayedOrderItems(
        { brandKor, phoneNumber },
        delayedCount
      );
    });
  }
}
