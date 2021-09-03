import { Injectable } from '@nestjs/common';

import { BatchWorker } from '@batch/batch.worker';

import { UpdateContentScoreJob } from './update-content-score';

@Injectable()
export class ContentJobsService {
  constructor(
    private readonly batchWorker: BatchWorker,
    private readonly updateContentScoreJob: UpdateContentScoreJob
  ) {}

  async updateContentScore() {
    return await this.batchWorker.run(this.updateContentScoreJob);
  }
}
