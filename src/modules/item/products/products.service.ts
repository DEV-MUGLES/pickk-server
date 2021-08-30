import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';
import { getOptionValueCombinations } from '@item/items/helpers';
import { Item } from '@item/items/models';

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
    private readonly productsRepository: ProductsRepository
  ) {}

  async get(id: number, relations: string[] = []): Promise<Product> {
    return await this.productsRepository.get(id, relations);
  }

  async list(
    productFilter?: ProductFilter,
    pageInput?: PageInput,
    relations: string[] = []
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

  async bulkRemove(products: Product[]) {
    await this.productsRepository.remove(products);
  }

  async createByOptionSet(item: Item) {
    if (item.products?.length > 0) {
      throw new ConflictException('프로덕트가 이미 존재합니다.');
    }

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

    products.forEach((product) => {
      const { quantity, isShipReserved } = restockProductDtos.find(
        ({ productId }) => productId === product.id
      );
      product.restock(quantity, isShipReserved);
    });

    await this.productsRepository.save(products);
  }
}
