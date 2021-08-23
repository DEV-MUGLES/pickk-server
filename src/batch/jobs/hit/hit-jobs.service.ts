import { Injectable } from '@nestjs/common';

import { BatchWorker } from '@batch/batch.worker';

import { UpdateHitCountJob } from './update-hit-count';

@Injectable()
export class HitJobsService {
  constructor(
    private readonly batchWorker: BatchWorker,
    private readonly updateHitCountJob: UpdateHitCountJob
  ) {}

  async updateHitCount() {
    return await this.batchWorker.run(this.updateHitCountJob);
  }
}
