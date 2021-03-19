import { Module } from '@nestjs/common';
import { CouriersModule } from './couriers/couriers.module';

@Module({
  imports: [CouriersModule],
})
export class ItemModule {}
