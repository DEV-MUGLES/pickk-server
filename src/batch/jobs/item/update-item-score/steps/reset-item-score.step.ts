import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';

import { ItemsRepository } from '@item/items/items.repository';

@Injectable()
export class ResetItemScoreStep extends BaseStep {
  constructor(
    @InjectRepository(ItemsRepository)
    private readonly itemsRepository: ItemsRepository
  ) {
    super();
  }

  async tasklet() {
    const resetIds = (
      await this.itemsRepository.find({
        select: ['id'],
        where: {
          isPurchasable: false,
          score: Not(0),
        },
      })
    ).map(({ id }) => id);

    await this.itemsRepository.bulkUpdate(resetIds, { score: 0 });
  }
}
