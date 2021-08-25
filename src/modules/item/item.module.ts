import { Module } from '@nestjs/common';

import { BrandsModule } from './brands/brands.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { CartsModule } from './carts/carts.module';
import { CouriersModule } from './couriers/couriers.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { ItemCategoriesModule } from './item-categories/item-categories.module';
import { ItemPropertiesModule } from './item-properties/item-properties.module';
import { ItemsModule } from './items/items.module';
import { ProductsModule } from './products/products.module';
import { SellersModule } from './sellers/sellers.module';

@Module({
  imports: [
    BrandsModule,
    CampaignsModule,
    CartsModule,
    CouriersModule,
    InquiriesModule,
    ItemCategoriesModule,
    ItemPropertiesModule,
    ItemsModule,
    ProductsModule,
    SellersModule,
  ],
})
export class ItemModule {}
