import { Injectable } from '@nestjs/common';

import { BatchWorker } from '@batch/batch.worker';

import { UpdateContentScoreJob } from './update-content-score';
import { UpdateYoutubeVideoDataJob } from './update-youtube-video-data';

@Injectable()
export class ContentJobsService {
  constructor(
    private readonly batchWorker: BatchWorker,
    private readonly updateContentScoreJob: UpdateContentScoreJob,
    private readonly updateYoutubeVideoDataJob: UpdateYoutubeVideoDataJob
  ) {}

  async updateContentScore() {
    return await this.batchWorker.run(this.updateContentScoreJob);
  }

  async updateYoutubeVideoData() {
    return await this.batchWorker.run(this.updateYoutubeVideoDataJob);
  }
}
