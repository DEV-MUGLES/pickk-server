import { Injectable } from '@nestjs/common';

import { BatchWorker } from '@batch/batch.worker';

@Injectable()
export class HitJobsService {
  constructor(private readonly batchWorker: BatchWorker) {}

  async updateHitCount() {
    return await this.batchWorker.run(null);
  }
}
