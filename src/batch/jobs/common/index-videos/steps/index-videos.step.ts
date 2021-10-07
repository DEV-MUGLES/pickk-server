import { Injectable } from '@nestjs/common';

import { VideosService } from '@content/videos/videos.service';
import { VideoSearchService } from '@mcommon/search/video.search.service';

@Injectable()
export class IndexVideosStep {
  constructor(
    private readonly videosService: VideosService,
    private readonly videoSearchService: VideoSearchService
  ) {}

  async tasklet() {
    const videos = await this.videosService.list(null, null, [
      'user',
      'digests',
      'digests.item',
      'digests.item.brand',
      'digests.item.minorCategory',
    ]);

    await this.videoSearchService.bulkIndex(videos);
  }
}
