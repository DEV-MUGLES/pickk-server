import { Module } from '@nestjs/common';

import { BrandsModule } from './brands/brands.module';
import { CouriersModule } from './couriers/couriers.module';
import { ItemCategoriesModule } from './item-categories/item-categories.module';
import { ItemsModule } from './items/items.module';
import { ProductsModule } from './products/products.module';
import { SellersModule } from './sellers/sellers.module';

@Module({
  imports: [
    BrandsModule,
    CouriersModule,
    ItemCategoriesModule,
    ItemsModule,
    ProductsModule,
    SellersModule,
  ],
})
export class ItemModule {}
