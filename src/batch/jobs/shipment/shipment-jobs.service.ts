import { Injectable } from '@nestjs/common';

import { BatchWorker } from '@batch/batch.worker';

import { TrackShipmentsJob } from './track-shipments';
import { RemoveNotReferedShipmentHistoriesJob } from './remove-not-refered-shipment-histories';

@Injectable()
export class ShipmentJobsService {
  constructor(
    private readonly batchWorker: BatchWorker,
    private readonly trackShipmentsJob: TrackShipmentsJob,
    private readonly removeNotReferedShipmentHistoriesJob: RemoveNotReferedShipmentHistoriesJob
  ) {}

  async trackShipments() {
    return await this.batchWorker.run(this.trackShipmentsJob);
  }

  async removeNotReferedShipmentHistories() {
    return await this.batchWorker.run(
      this.removeNotReferedShipmentHistoriesJob
    );
  }
}
