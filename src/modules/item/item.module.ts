import { Module } from '@nestjs/common';

import { BrandsModule } from './brands/brands.module';
import { CouriersModule } from './couriers/couriers.module';
import { SellersModule } from './sellers/sellers.module';

@Module({
  imports: [BrandsModule, CouriersModule, SellersModule],
})
export class ItemModule {}
