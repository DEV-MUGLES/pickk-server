import { Module } from '@nestjs/common';

import { BrandsModule } from '@item/brands/brands.module';
import { CouriersModule } from '@item/couriers/couriers.module';
import { SellersModule } from '@item/sellers/sellers.module';
import { BrandsSeeder } from './brands.seeder';
import { CouriersSeeder } from './couriers.seeder';
import { ItemSeeder } from './item.seeder';
import { SellersSeeder } from './sellers.seeder';

@Module({
  imports: [SellersModule, CouriersModule, BrandsModule],
  providers: [ItemSeeder, BrandsSeeder, CouriersSeeder, SellersSeeder],
  exports: [ItemSeeder],
})
export class ItemSeederModule {}
