import { Module } from '@nestjs/common';

import { CommonJobsModule } from './jobs/common';
import { ContentJobsModule } from './jobs/content';
import { HitJobsModule } from './jobs/hit';
import { ItemJobsModule } from './jobs/item';
import { OrderJobsModule } from './jobs/order';
import { PaymentJobsModule } from './jobs/payment';
import { ShipmentJobsModule } from './jobs/shipment';

@Module({
  imports: [
    CommonJobsModule,
    ContentJobsModule,
    HitJobsModule,
    ItemJobsModule,
    OrderJobsModule,
    PaymentJobsModule,
    ShipmentJobsModule,
  ],
})
export class BatchModule {}
