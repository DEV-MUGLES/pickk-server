import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';

import { getOptionValueCombinations } from '@item/items/helpers';
import { ItemsService } from '@item/items/items.service';

import { ProductRelationType } from './constants';
import {
  DestockProductInput,
  ProductFilter,
  RestockProductDto,
  UpdateProductInput,
} from './dtos';
import { Product } from './models';

import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsRepository)
    private readonly productsRepository: ProductsRepository,
    private readonly itemsService: ItemsService
  ) {}

  async get(id: number, relations: string[] = []): Promise<Product> {
    return await this.productsRepository.get(id, relations);
  }

  async list(
    productFilter?: ProductFilter,
    pageInput?: PageInput,
    relations: ProductRelationType[] = []
  ): Promise<Product[]> {
    const _productFilter = plainToClass(ProductFilter, productFilter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.productsRepository.entityToModelMany(
      await this.productsRepository.find({
        relations,
        where: parseFilter(_productFilter, _pageInput?.idFilter),
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }

  async update(
    product: Product,
    updateProductInput: UpdateProductInput,
    relations: string[] = []
  ): Promise<Product> {
    return await this.productsRepository.updateEntity(
      product,
      updateProductInput,
      relations
    );
  }

  async bulkEnrichProduct<Enriched, Model>(
    models: Model[],
    propertyName = 'product',
    relations: ProductRelationType[] = []
  ): Promise<(Model & Enriched)[]> {
    const productIds = models.map((model) => model[`${propertyName}Id`]);
    const products = await this.list({ idIn: productIds }, null, relations);

    for (const model of models) {
      const product = products.find((v) => v.id === model[`${propertyName}Id`]);
      if (product) {
        model[propertyName] = product;
      }
    }

    return models as (Model & Enriched)[];
  }

  async processDeleted(itemId: number) {
    const productIds = (
      await this.productsRepository.find({
        select: ['id'],
        where: { itemId, isDeleted: false },
      })
    ).map(({ id }) => id);
    if (!productIds?.length) {
      return;
    }
    await this.productsRepository.update(productIds, { isDeleted: true });
  }

  async createByOptionSet(itemId: number) {
    const item = await this.itemsService.get(itemId, [
      'options',
      'options.values',
      'products',
    ]);

    await this.processDeleted(itemId);
    const products = getOptionValueCombinations(item.options).map((values) => {
      const totalPriceVariant = values.reduce(
        (total, { priceVariant }) => total + priceVariant,
        0
      );
      return new Product({
        item,
        priceVariant: totalPriceVariant,
        itemOptionValues: values,
      });
    });
    await this.productsRepository.save(products);
  }

  async bulkDestock(destockProductInputs: DestockProductInput[]) {
    const productIds = destockProductInputs.map(({ productId }) => productId);
    const products = await this.productsRepository.findByIds(productIds);

    products.forEach((product) => {
      if (product.item.isInfiniteStock) {
        // 무한재고 상품이면 destock하지 않는다.
        return;
      }

      const { quantity } = destockProductInputs.find(
        ({ productId }) => product.id === productId
      );
      product.destock(quantity);
    });

    await this.productsRepository.save(products);
  }

  async bulkRestock(restockProductDtos: RestockProductDto[]) {
    const productIds = restockProductDtos.map(({ productId }) => productId);
    const products = await this.productsRepository.findByIds(productIds);

    restockProductDtos.forEach(({ productId, quantity, isShipReserved }) => {
      const product = products.find((product) => product.id === productId);
      if (product.item.isInfiniteStock) {
        // 무한재고 상품이면 restock하지 않는다.
        return;
      }

      product.restock(quantity, isShipReserved);
    });
    await this.productsRepository.save(products);
  }
}
