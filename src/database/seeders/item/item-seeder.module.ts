import { Module } from '@nestjs/common';

import { BrandsModule } from '@item/brands/brands.module';
import { CouriersModule } from '@item/couriers/couriers.module';
import { SellersModule } from '@item/sellers/sellers.module';
import { ProductsModule } from '@item/products/products.module';
import { ItemsModule } from '@item/items/items.module';
import {
  BrandsSeeder,
  CouriersSeeder,
  SellersSeeder,
  ItemCategoriesSeeder,
  ProductsSeeder,
  ItemsSeeder,
  ItemSeeder,
} from '.';

@Module({
  imports: [
    SellersModule,
    CouriersModule,
    BrandsModule,
    ProductsModule,
    ItemsModule,
  ],
  providers: [
    ItemSeeder,
    ItemsSeeder,
    BrandsSeeder,
    CouriersSeeder,
    SellersSeeder,
    ItemCategoriesSeeder,
    ProductsSeeder,
  ],
  exports: [ItemSeeder],
})
export class ItemSeederModule {}
