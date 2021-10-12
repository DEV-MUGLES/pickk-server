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
    const productStockDatas: Array<{
      itemId: number;
      totalStock: number;
      isInfiniteStock: boolean;
    }> = (
      await this.productsRepository
        .createQueryBuilder('product')
        .leftJoin('product.shippingReservePolicy', 'reservedProduct')
        .leftJoin('product.item', 'item')
        .select(
          'sum(product.stock) as stocks, product.itemId, sum(reservedProduct.stock) as reservedStocks, item.isInfiniteStock'
        )
        .addGroupBy('itemId')
        .execute()
    ).map(({ itemId, isInfiniteStock, stocks, reservedStocks }) => ({
      itemId: Number(itemId),
      totalStock: Number(stocks) + Number(reservedStocks ?? 0),
      isInfiniteStock,
    }));

    const isSolout = (totalStock: number, isInfiniteStock: boolean) => {
      if (isInfiniteStock) return false;
      if (totalStock > 0) return false;
      return true;
    };

    const soldOutItemIds = productStockDatas
      .filter(({ totalStock, isInfiniteStock }) =>
        isSolout(totalStock, isInfiniteStock)
      )
      .map(({ itemId }) => itemId);

    const notSoldOutItemIds = productStockDatas
      .filter(
        ({ totalStock, isInfiniteStock }) =>
          !isSolout(totalStock, isInfiniteStock)
      )
      .map(({ itemId }) => itemId);

    await this.itemsRepository.bulkUpdate(soldOutItemIds, { isSoldout: true });
    await this.itemsRepository.bulkUpdate(notSoldOutItemIds, {
      isSoldout: false,
    });
  }
}
