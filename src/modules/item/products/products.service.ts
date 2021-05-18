import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getOptionValueCombinations } from '../items/helpers/item.helper';

import { Item } from '../items/models/item.model';

import { Product } from './models/product.model';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsRepository)
    private readonly productsRepository: ProductsRepository
  ) {}

  async bulkRemove(products: Product[]) {
    await this.productsRepository.remove(products);
  }

  async createByOptionSet(item: Item) {
    if (item.products?.length > 0) {
      throw new ConflictException('프로덕트가 이미 존재합니다.');
    }

    const products = getOptionValueCombinations(item.options).map(
      (values) => new Product({ item, itemOptionValues: values })
    );
    await this.productsRepository.save(products);
  }
}
