import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';

import { OrderBuyersRepository } from '@order/orders/orders.repository';

@Injectable()
export class RemoveOrderBuyersStep extends BaseStep {
  constructor(
    @InjectRepository(OrderBuyersRepository)
    private readonly orderBuyersRepository: OrderBuyersRepository
  ) {
    super();
  }

  async tasklet() {
    const notReferedBuyers = await this.orderBuyersRepository.find({
      relations: ['order'],
      where: {
        order: {
          merchantUid: IsNull(),
        },
      },
    });
    await this.orderBuyersRepository.remove(notReferedBuyers);
  }
}
