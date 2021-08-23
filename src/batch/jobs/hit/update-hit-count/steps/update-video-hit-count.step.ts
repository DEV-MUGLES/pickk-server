import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { JobExecutionContext } from '@batch/models';
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

  async tasklet(context: JobExecutionContext): Promise<void> {
    const countMap = await this.hitsService.getOwnerCountMap(
      HitOwnerType.Video
    );
    const digestIds = Object.keys(countMap).map((id) => Number(id));

    const videos = await this.videosRepository.findByIds(digestIds);
    const hitCountUpdatedVideos = videos.map(({ id, hitCount }) => ({
      id,
      hitCount: hitCount + Number(countMap[id]),
    }));

    await this.videosRepository.save(hitCountUpdatedVideos);
    await this.hitsService.clearOwnerCountMap(HitOwnerType.Video);
    context.put('video', hitCountUpdatedVideos);
  }
}
