import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan } from 'typeorm';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { BaseStep } from '@batch/jobs/base.step';

import { OrderItemsProducer } from '@order/order-items/producers';
import { OrderStatus } from '@order/orders/constants';
import { OrdersRepository } from '@order/orders/orders.repository';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class RemoveExpiredOrdersStep extends BaseStep {
  constructor(
    @InjectRepository(OrdersRepository)
    private readonly ordersRepository: OrdersRepository,
    private readonly orderItemsProducer: OrderItemsProducer
  ) {
    super();
  }

  async tasklet() {
    const yesterdayMerchantUid =
      dayjs().tz('Asia/Seoul').subtract(1, 'day').format('YYMMDD') +
      '00000000000';

    const expiredOrders = await this.ordersRepository.find({
      relations: ['orderItems'],
      where: {
        status: In([OrderStatus.Failed, OrderStatus.Pending]),
        merchantUid: LessThan(yesterdayMerchantUid),
      },
    });
    await this.ordersRepository.remove(expiredOrders);

    const orderItemMerchantUids = expiredOrders.reduce(
      (acc, { orderItems }) => [
        ...acc,
        ...orderItems.map((v) => v.merchantUid),
      ],
      []
    );
    await this.orderItemsProducer.deleteOrderItemsIndex(orderItemMerchantUids);
  }
}
