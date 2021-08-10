import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual } from 'typeorm';
import dayjs from 'dayjs';

import { OrderItemsRepository } from '@order/order-items/order-items.repository';

import { OrderItemsCountOutput } from './dtos';

@Injectable()
export class SellerOrderItemService {
  constructor(
    @InjectRepository(OrderItemsRepository)
    private readonly orderItemsRepository: OrderItemsRepository
  ) {}

  async getCount(sellerId: number): Promise<OrderItemsCountOutput> {
    const orderItems = await this.orderItemsRepository.find({
      select: ['status', 'claimStatus'],
      where: {
        sellerId,
        createdAt: MoreThanOrEqual(dayjs().subtract(1, 'month').toDate()),
      },
    });

    return OrderItemsCountOutput.create(sellerId, orderItems);
  }
}
