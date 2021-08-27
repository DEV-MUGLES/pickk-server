import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BatchWorker } from '@batch/batch.worker';
import { JobsModule } from '@mcommon/jobs/jobs.module';
import { ShipmentsRepository } from '@order/shipments/shipments.repository';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';
import { DeliveryTrackerProviderModule } from '@providers/delivery-tracker';

import { TrackShipmentsJob, TrackShipmentsStep } from './track-shipments';

import { ShipmentJobsService } from './shipment-jobs.service';
import { ShipmentJobsController } from './shipment-jobs.controller';

@Module({
  imports: [
    JobsModule,
    DeliveryTrackerProviderModule,
    TypeOrmModule.forFeature([ShipmentsRepository, OrderItemsRepository]),
  ],
  controllers: [ShipmentJobsController],
  providers: [
    BatchWorker,
    ShipmentJobsService,
    TrackShipmentsJob,
    TrackShipmentsStep,
  ],
})
export class ShipmentJobsModule {}
