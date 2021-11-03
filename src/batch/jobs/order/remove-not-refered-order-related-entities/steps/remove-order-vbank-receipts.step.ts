import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';

import { OrderVbankReceiptsRepository } from '@order/orders/orders.repository';

@Injectable()
export class RemoveOrderVbankReceiptsStep extends BaseStep {
  constructor(
    @InjectRepository(OrderVbankReceiptsRepository)
    private readonly orderVbankReceiptsRepository: OrderVbankReceiptsRepository
  ) {
    super();
  }

  async tasklet() {
    const notReferedVbankReceipts =
      await this.orderVbankReceiptsRepository.find({
        relations: ['order'],
        where: {
          order: {
            merchantUid: IsNull(),
          },
        },
      });
    await this.orderVbankReceiptsRepository.remove(notReferedVbankReceipts);
  }
}
