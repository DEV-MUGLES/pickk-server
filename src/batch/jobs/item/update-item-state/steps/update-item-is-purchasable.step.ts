import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { ItemsRepository } from '@item/items/items.repository';

@Injectable()
export class UpdateItemIsPurchasableStep extends BaseStep {
  constructor(
    @InjectRepository(ItemsRepository)
    private readonly itemsRepository: ItemsRepository
  ) {
    super();
  }

  async tasklet(): Promise<void> {
    const itemIds = (
      await this.itemsRepository.find({
        select: ['id'],
        where: { isSellable: false, isPurchasable: true },
      })
    ).map(({ id }) => id);

    await this.itemsRepository.bulkUpdate(itemIds, { isPurchasable: false });
  }
}
