import { Module } from '@nestjs/common';

import { HitJobsModule } from './jobs/hit/hit-jobs.module';
import { ItemJobsModule } from './jobs/item/item-jobs.module';
import { OrderJobsModule } from './jobs/order/order-jobs.module';

@Module({
  imports: [ItemJobsModule, OrderJobsModule, HitJobsModule],
})
export class BatchModule {}
