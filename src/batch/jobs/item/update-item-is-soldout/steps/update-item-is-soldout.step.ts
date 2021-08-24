import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { ProductsRepository } from '@item/products/products.repository';
import { ItemsRepository } from '@item/items/items.repository';

@Injectable()
export class UpdateItemIsSoldoutStep extends BaseStep {
  constructor(
    @InjectRepository(ProductsRepository)
    private readonly productsRepository: ProductsRepository,
    @InjectRepository(ItemsRepository)
    private readonly itemsRepository: ItemsRepository
  ) {
    super();
  }

  async tasklet(): Promise<void> {
    const products = await this.productsRepository
      .createQueryBuilder('product')
      .select('sum(stock) as stocks, itemId')
      .addGroupBy('itemId')
      .execute();

    const soldOutItemIds = products
      .filter(({ stocks }) => stocks === 0)
      .map(({ itemId }) => itemId);

    const notSoldOutItemIds = products
      .filter(({ stocks }) => stocks > 0)
      .map(({ itemId }) => itemId);

    await this.itemsRepository.bulkUpdate(soldOutItemIds, { isSoldout: true });
    await this.itemsRepository.bulkUpdate(notSoldOutItemIds, {
      isSoldout: false,
    });
  }
}
