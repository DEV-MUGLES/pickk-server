import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';

import { BaseConsumer } from '@common/base.consumer';
import { UPDATE_VIDEO_LIKE_COUNT_QUEUE } from '@queue/constants';
import { UpdateLikeCountMto } from '@queue/mtos';

import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';

import { VideosRepository } from '../videos.repository';

@SqsProcess(UPDATE_VIDEO_LIKE_COUNT_QUEUE)
export class UpdateVideoLikeCountConsumer extends BaseConsumer {
  constructor(
    @InjectRepository(VideosRepository)
    private readonly videosRepository: VideosRepository,
    private readonly likesService: LikesService,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler(true)
  async updateLikeCount(messages: AWS.SQS.Message[]) {
    const mtos: UpdateLikeCountMto[] = messages.map(({ Body }) =>
      JSON.parse(Body)
    );

    const uniqueIds = [...new Set(mtos.map(({ id }) => id))];
    await Promise.all(
      uniqueIds.map(
        (id) =>
          new Promise(async (resolve, reject) => {
            try {
              const likeCount = await this.likesService.count(
                LikeOwnerType.Video,
                id
              );
              const video = await this.videosRepository.update(id, {
                likeCount,
              });
              resolve(video);
            } catch (error) {
              reject(`videoId: ${id} UpdateLikeCount Error: ${error}`);
            }
          })
      )
    );
  }
}
