import { Injectable } from '@nestjs/common';

import { BatchWorker } from '@batch/batch.worker';

import { TrackShipmentsJob } from './track-shipments';

@Injectable()
export class ShipmentJobsService {
  constructor(
    private readonly batchWorker: BatchWorker,
    private readonly trackShipmentsJob: TrackShipmentsJob
  ) {}

  async trackShipments() {
    return await this.batchWorker.run(this.trackShipmentsJob);
  }
}
