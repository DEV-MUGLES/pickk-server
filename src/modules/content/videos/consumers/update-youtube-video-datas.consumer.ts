import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { IYoutubeVideoData } from '@providers/youtube/interfaces';
import { YoutubeProviderService } from '@providers/youtube/provider.service';

import { BaseConsumer } from '@common/base.consumer';
import { FulfillResponse, allSettled, isFulfilled } from '@common/helpers';
import { UPDATE_YOUTUBE_VIDEO_DATAS_QUEUE } from '@queue/constants';
import { UpdateYoutubeVideoDatasMto } from '@queue/mtos';

import { VideosRepository } from '../videos.repository';

@SqsProcess(UPDATE_YOUTUBE_VIDEO_DATAS_QUEUE)
export class UpdateYoutubeVideoDatasConsumer extends BaseConsumer {
  constructor(
    @InjectRepository(VideosRepository)
    private readonly videosRepository: VideosRepository,
    private readonly youtubeService: YoutubeProviderService,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler()
  async updateCommentCount(message: AWS.SQS.Message) {
    const { youtubeCodes }: UpdateYoutubeVideoDatasMto = JSON.parse(
      message.Body
    );

    const videoDatas = await allSettled<IYoutubeVideoData>(
      youtubeCodes.map(
        (youtubeCode) =>
          new Promise(async (resolve, reject) => {
            try {
              const videoData = await this.youtubeService.getVideoData(
                youtubeCode
              );
              resolve(videoData);
            } catch (err) {
              reject(err);
            }
          })
      )
    );

    const fulfilledVideoDatas = videoDatas
      .filter(isFulfilled)
      .map((videoData: FulfillResponse<IYoutubeVideoData>) => videoData.value);

    for (const {
      code: youtubeCode,
      viewCount: youtubeViewCount,
      duration: youtubeDuration,
    } of fulfilledVideoDatas) {
      await this.videosRepository.update(
        { youtubeCode },
        { youtubeViewCount, youtubeDuration }
      );
    }
  }
}
