import { Module } from '@nestjs/common';

import { BrandsModule } from './brands/brands.module';
import { CouriersModule } from './couriers/couriers.module';
import { ItemsModule } from './items/items.module';
import { SellersModule } from './sellers/sellers.module';

@Module({
  imports: [BrandsModule, CouriersModule, ItemsModule, SellersModule],
})
export class ItemModule {}
