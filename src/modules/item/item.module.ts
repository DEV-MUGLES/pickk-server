import { Module } from '@nestjs/common';

import { BrandsModule } from './brands/brands.module';
import { CouriersModule } from './couriers/couriers.module';
import { ItemProfilesModule } from './item-profiles/item-profiles.module';
import { SellersModule } from './sellers/sellers.module';

@Module({
  imports: [BrandsModule, CouriersModule, ItemProfilesModule, SellersModule],
})
export class ItemModule {}
