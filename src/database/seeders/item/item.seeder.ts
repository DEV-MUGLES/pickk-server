import { Injectable } from '@nestjs/common';

import {
  ProductsSeeder,
  ItemsSeeder,
  ItemCategoriesSeeder,
  BrandsSeeder,
  CouriersSeeder,
  SellersSeeder,
} from '.';

@Injectable()
export class ItemSeeder {
  constructor(
    private brandsSeeder: BrandsSeeder,
    private couriersSeeder: CouriersSeeder,
    private sellersSeeder: SellersSeeder,
    private itemCategoriesSeeder: ItemCategoriesSeeder,
    private itemsSeeder: ItemsSeeder,
    private productsSeeder: ProductsSeeder
  ) {}

  async createBrandCourierSeller(userIds: number[]) {
    const brands = await this.brandsSeeder.create();
    const brandIds = brands.map((brand) => brand.id);
    await this.couriersSeeder.create();
    await this.sellersSeeder.create(userIds, brandIds);
  }

  async createItemProduct() {
    await this.itemCategoriesSeeder.create();
    const items = await this.itemsSeeder.create();
    await this.productsSeeder.create(items);
  }
}
