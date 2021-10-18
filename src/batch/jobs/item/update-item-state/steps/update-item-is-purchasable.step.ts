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
    const notPurchasables = await this.itemsRepository.find({
      select: ['id'],
      where: { isSellable: false, isPurchasable: true },
    });
    await this.itemsRepository.bulkUpdate(
      notPurchasables.map((v) => v.id),
      { isPurchasable: false }
    );

    const purchasables = await this.itemsRepository
      .createQueryBuilder('item')
      .innerJoin('item.products', 'product', 'product.isDeleted = false')
      .where('item.isSellable = true')
      .andWhere('item.isPurchasable = false')
      .getMany();
    await this.itemsRepository.bulkUpdate(
      purchasables.map((v) => v.id),
      { isPurchasable: true }
    );
  }
}
