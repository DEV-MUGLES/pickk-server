import { Injectable } from '@nestjs/common';

import { BatchWorker } from '@batch/batch.worker';

import { UpdateContentScoreJob } from './update-content-score';
import { RemoveDeletedDigestImagesJob } from './remove-deleted-digest-images';

@Injectable()
export class ContentJobsService {
  constructor(
    private readonly batchWorker: BatchWorker,
    private readonly updateContentScoreJob: UpdateContentScoreJob,
    private readonly removeDeletedDigestImagesJob: RemoveDeletedDigestImagesJob
  ) {}

  async updateContentScore() {
    return await this.batchWorker.run(this.updateContentScoreJob);
  }

  async removeDeletedDigestImages() {
    return await this.batchWorker.run(this.removeDeletedDigestImagesJob);
  }
}
