import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan } from 'typeorm';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { BaseStep } from '@batch/jobs/base.step';

import { OrdersRepository } from '@order/orders/orders.repository';
import { OrderStatus } from '@order/orders/constants';
import { ProductsService } from '@item/products/products.service';
import { RestockProductDto } from '@item/products/dtos';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class RemovePayingOrdersStep extends BaseStep {
  constructor(
    @InjectRepository(OrdersRepository)
    private readonly ordersRepository: OrdersRepository,
    private readonly productsService: ProductsService
  ) {
    super();
  }

  async tasklet() {
    const pastMerchantUid =
      dayjs().tz('Asia/Seoul').subtract(2, 'hour').format('YYMMDDHHmmssSSS') +
      '00';

    const payingOrders = await this.ordersRepository.find({
      relations: ['orderItems'],
      where: {
        status: OrderStatus.Paying,
        merchantUid: LessThan(pastMerchantUid),
      },
    });
    const restockProductDtos = payingOrders.reduce(
      (total, { orderItems }) =>
        total.concat(orderItems.map((oi) => oi as RestockProductDto)),
      []
    );

    await this.ordersRepository.remove(payingOrders);
    await this.productsService.bulkRestock(restockProductDtos);
  }
}
