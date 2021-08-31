import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { IsNull, LessThan } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { OrderItemStatus } from '@order/order-items/constants';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';

@Injectable()
export class ConfirmOrderItemsStep extends BaseStep {
  constructor(
    @InjectRepository(OrderItemsRepository)
    private readonly orderItemsRepository: OrderItemsRepository
  ) {
    super();
  }
  async tasklet() {
    const notConfirmedOrderItemMerchantUids = (
      await this.orderItemsRepository.find({
        select: ['merchantUid'],
        where: {
          status: OrderItemStatus.Shipped,
          isConfirmed: false,
          claimStatus: IsNull(),
          shippedAt: LessThan(dayjs().add(-14, 'day').toDate()),
        },
      })
    ).map(({ merchantUid }) => merchantUid);
    //@TODO: reviewer에게 reward지급하기
    await this.orderItemsRepository.update(notConfirmedOrderItemMerchantUids, {
      isConfirmed: true,
    });
  }
}
