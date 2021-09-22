import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { In, LessThan } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';

import { OrdersRepository } from '@order/orders/orders.repository';
import { OrderStatus } from '@order/orders/constants';

@Injectable()
export class RemoveExpiredOrdersStep extends BaseStep {
  constructor(
    @InjectRepository(OrdersRepository)
    private readonly ordersRepository: OrdersRepository
  ) {
    super();
  }

  async tasklet() {
    const expiredOrders = await this.ordersRepository.find({
      status: In([OrderStatus.Failed, OrderStatus.Pending]),
      createdAt: LessThan(dayjs().subtract(1, 'day').toDate()),
    });
    await this.ordersRepository.remove(expiredOrders);
  }
}
