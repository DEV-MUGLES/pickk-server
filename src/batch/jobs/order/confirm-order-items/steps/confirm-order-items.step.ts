import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { IsNull, LessThan } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';

import { OrderItemStatus } from '@order/order-items/constants';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';
import { OrderItemsService } from '@order/order-items/order-items.service';

@Injectable()
export class ConfirmOrderItemsStep extends BaseStep {
  constructor(
    @InjectRepository(OrderItemsRepository)
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly orderItemsService: OrderItemsService
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

    for (const merchantUid of notConfirmedOrderItemMerchantUids) {
      await this.orderItemsService.confirm(merchantUid);
    }
  }
}
