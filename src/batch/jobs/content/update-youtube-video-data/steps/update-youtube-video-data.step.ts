import { Injectable } from '@nestjs/common';

import { VideosProducer } from '@content/videos/producers';
import { VideosService } from '@content/videos/videos.service';

import { BaseStep } from '@batch/jobs/base.step';

@Injectable()
export class UpdateYoutubeVideoDataStep extends BaseStep {
  constructor(
    private readonly videosService: VideosService,
    private readonly videosProducer: VideosProducer
  ) {
    super();
  }
  async tasklet() {
    const videos = await this.videosService.list();

    const CHUNK_SIZE = 100;

    for (let i = 0; i < videos.length; i += CHUNK_SIZE) {
      await this.videosProducer.updateYoutubeVideoData(
        videos.slice(i, i + CHUNK_SIZE).map(({ youtubeCode }) => youtubeCode)
      );
    }
  }
}
