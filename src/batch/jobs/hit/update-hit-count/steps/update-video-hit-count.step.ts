import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { VideosRepository } from '@content/videos/videos.repository';
import { HitOwnerType } from '@mcommon/hits/constants';
import { HitsService } from '@mcommon/hits/hits.service';

@Injectable()
export class UpdateVideoHitCountStep extends BaseStep {
  constructor(
    @InjectRepository(VideosRepository)
    private readonly videosRepository: VideosRepository,
    private readonly hitsService: HitsService
  ) {
    super();
  }

  async tasklet(): Promise<void> {
    const countMap = await this.hitsService.getOwnerCountMap(
      HitOwnerType.VIDEO
    );
    const videoIds = Object.keys(countMap);

    const videos = await this.videosRepository.findByIds(videoIds);
    videos.forEach((video) => {
      video.hitCount += countMap[video.id];
    });

    await this.videosRepository.save(videos);
    await this.hitsService.clearOwnerCountMap(HitOwnerType.VIDEO);
  }
}
