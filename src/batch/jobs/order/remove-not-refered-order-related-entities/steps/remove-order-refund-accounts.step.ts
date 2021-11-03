import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';

import { OrderRefundAccountsRepository } from '@order/orders/orders.repository';

@Injectable()
export class RemoveOrderRefundAccountsStep extends BaseStep {
  constructor(
    @InjectRepository(OrderRefundAccountsRepository)
    private readonly orderRefundAccountsRepository: OrderRefundAccountsRepository
  ) {
    super();
  }

  async tasklet() {
    const notReferedRefundAccounts =
      await this.orderRefundAccountsRepository.find({
        relations: ['order'],
        where: {
          order: {
            merchantUid: IsNull(),
          },
        },
      });
    await this.orderRefundAccountsRepository.remove(notReferedRefundAccounts);
  }
}
