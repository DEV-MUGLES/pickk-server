import { Module } from '@nestjs/common';

import { CommonJobsModule } from './jobs/common';
import { ContentJobsModule } from './jobs/content';
import { HitJobsModule } from './jobs/hit';
import { ItemJobsModule } from './jobs/item';
import { OrderJobsModule } from './jobs/order';
import { ShipmentJobsModule } from './jobs/shipment';

@Module({
  imports: [
    CommonJobsModule,
    ItemJobsModule,
    OrderJobsModule,
    HitJobsModule,
    ShipmentJobsModule,
    ContentJobsModule,
  ],
})
export class BatchModule {}
