import { Module } from '@nestjs/common';
import { BrandsModule } from './brands/brands.module';
import { CouriersModule } from './couriers/couriers.module';

@Module({
  imports: [BrandsModule, CouriersModule],
})
export class ItemModule {}
