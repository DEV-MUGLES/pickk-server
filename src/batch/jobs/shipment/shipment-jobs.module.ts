import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BatchWorker } from '@batch/batch.worker';
import { JobsModule } from '@mcommon/jobs/jobs.module';
import { DeliveryTrackerProviderModule } from '@providers/delivery-tracker';

import { ExchangeRequestsModule } from '@order/exchange-requests/exchange-requests.module';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';
import {
  ShipmentHistoriesRepository,
  ShipmentsRepository,
} from '@order/shipments/shipments.repository';

import { TrackShipmentsJob, TrackShipmentsStep } from './track-shipments';
import {
  RemoveNotReferedShipmentHistoriesStep,
  RemoveNotReferedShipmentHistoriesJob,
} from './remove-not-refered-shipment-histories';

import { ShipmentJobsService } from './shipment-jobs.service';
import { ShipmentJobsController } from './shipment-jobs.controller';

@Module({
  imports: [
    JobsModule,
    DeliveryTrackerProviderModule,
    TypeOrmModule.forFeature([
      ShipmentsRepository,
      OrderItemsRepository,
      ShipmentHistoriesRepository,
    ]),
    ExchangeRequestsModule,
  ],
  controllers: [ShipmentJobsController],
  providers: [
    BatchWorker,
    ShipmentJobsService,
    TrackShipmentsJob,
    TrackShipmentsStep,
    RemoveNotReferedShipmentHistoriesStep,
    RemoveNotReferedShipmentHistoriesJob,
  ],
})
export class ShipmentJobsModule {}
