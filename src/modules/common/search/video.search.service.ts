import { Injectable } from '@nestjs/common';

import { BaseSearchService } from '@common/base.search.service';
import { SearchService } from '@providers/elasticsearch';

import { IVideo } from '@content/videos/interfaces';
import { Video } from '@content/videos/models';
import { VideosService } from '@content/videos/videos.service';

export type VideoSearchBody = Pick<IVideo, 'id' | 'title'> & {
  userNickname: string;
  digestTitles?: string;
  itemNames: string;
  brandNameKors: string;
  minorCategoryNames?: string;
};

@Injectable()
export class VideoSearchService extends BaseSearchService<
  Video,
  VideoSearchBody
> {
  name = 'videos';

  constructor(
    readonly searchService: SearchService,
    private readonly videoService: VideosService
  ) {
    super();
  }

  async getModel(id: number): Promise<Video> {
    return await this.videoService.get(id, [
      'digests',
      'digests.item',
      'digests.item.brand',
      'digests.item.minorCategory',
      'user',
    ]);
  }

  toBody(video: Video): VideoSearchBody {
    return {
      id: video.id,
      title: video.title,
      userNickname: video.user.nickname,
      digestTitles:
        video.digests
          .map((v) => v.title)
          .filter((v) => v)
          .join(', ') || '',
      itemNames: video.digests.map((v) => v.item?.name).join(', '),
      brandNameKors: video.digests
        .map((v) => v.item?.brand?.nameKor)
        .filter((v) => v)
        .join(', '),
      minorCategoryNames:
        video.digests
          .map((v) => v.item?.minorCategory?.name)
          .filter((v) => v)
          .join(', ') || ' ',
    };
  }
}
