import { Module } from '@nestjs/common';

import { ItemJobsModule } from './jobs/item/item-jobs.module';
import { OrderJobsModule } from './jobs/order/order-jobs.module';

@Module({
  imports: [ItemJobsModule, OrderJobsModule],
})
export class BatchModule {}
