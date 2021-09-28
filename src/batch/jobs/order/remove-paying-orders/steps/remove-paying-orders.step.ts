import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { LessThan } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';

import { OrdersRepository } from '@order/orders/orders.repository';
import { OrderStatus } from '@order/orders/constants';
import { ProductsService } from '@item/products/products.service';
import { RestockProductDto } from '@item/products/dtos';

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
    const payingOrders = await this.ordersRepository.find({
      relations: ['orderItems'],
      where: {
        status: OrderStatus.Paying,
        createdAt: LessThan(dayjs().subtract(2, 'hour').toDate()),
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
