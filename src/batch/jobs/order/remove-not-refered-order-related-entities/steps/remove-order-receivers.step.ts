import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';

import { OrderReceiversRepository } from '@order/orders/orders.repository';

@Injectable()
export class RemoveOrderReceiversStep extends BaseStep {
  constructor(
    @InjectRepository(OrderReceiversRepository)
    private readonly orderReceiversRepository: OrderReceiversRepository
  ) {
    super();
  }

  async tasklet() {
    const notReferedReceivers = await this.orderReceiversRepository.find({
      relations: ['order'],
      where: {
        order: {
          merchantUid: IsNull(),
        },
      },
    });
    await this.orderReceiversRepository.remove(notReferedReceivers);
  }
}
