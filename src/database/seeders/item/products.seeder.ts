import { Injectable } from '@nestjs/common';

import { Item } from '@item/items/models/item.model';
import { ProductsService } from '@item/products/products.service';
import { ITEM_COUNT } from '../data';

@Injectable()
export class ProductsSeeder {
  constructor(private productsService: ProductsService) {}

  async create(items: Item[]) {
    await Promise.all(
      [...Array(ITEM_COUNT)].map((_, index) =>
        this.productsService.createByOptionSet(items[index])
      )
    );
  }
}
