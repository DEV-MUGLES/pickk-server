import { Injectable } from '@nestjs/common';

import { BatchWorker } from '@batch/batch.worker';

import { UpdateDigestScoreJob } from './update-digest-score';
import { UpdateLookScoreJob } from './update-look-score';
import { UpdateVideoScoreJob } from './update-video-score';

@Injectable()
export class ContentJobsService {
  constructor(
    private readonly batchWorker: BatchWorker,
    private readonly updateDigestScoreJob: UpdateDigestScoreJob,
    private readonly updateLookScoreJob: UpdateLookScoreJob,
    private readonly updateVideoScoreJob: UpdateVideoScoreJob
  ) {}

  async updateDigestScore() {
    return await this.batchWorker.run(this.updateDigestScoreJob);
  }

  async updateLookScore() {
    return await this.batchWorker.run(this.updateLookScoreJob);
  }

  async updateVideoScore() {
    return await this.batchWorker.run(this.updateVideoScoreJob);
  }
}
