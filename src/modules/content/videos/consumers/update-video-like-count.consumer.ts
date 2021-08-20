import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { allSettled } from '@common/helpers';
import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';
import { UPDATE_VIDEO_LIKE_COUNT_QUEUE } from '@queue/constants';
import { UpdateLikeCountMto } from '@queue/mtos';

import { VideosRepository } from '../videos.repository';

@SqsProcess(UPDATE_VIDEO_LIKE_COUNT_QUEUE)
export class UpdateVideoLikeCountConsumer {
  constructor(
    @InjectRepository(VideosRepository)
    private readonly videosRepository: VideosRepository,
    private readonly likesService: LikesService
  ) {}

  @SqsMessageHandler(true)
  async updateLikeCount(messages: AWS.SQS.Message[]) {
    const mtos: UpdateLikeCountMto[] = messages.map((m) => JSON.parse(m.Body));

    const uniqueIds = [...new Set(mtos.map((m) => m.id))];
    await allSettled(
      uniqueIds.map(
        (id) =>
          new Promise(async (resolve, reject) => {
            try {
              const likeCount = await this.likesService.count(
                LikeOwnerType.Video,
                id
              );
              resolve(this.videosRepository.update(id, { likeCount }));
            } catch (err) {
              reject({ id, reason: err });
            }
          })
      )
    );
  }
}
