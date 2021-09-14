import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { allSettled } from '@common/helpers';
import { UPDATE_VIDEO_COMMENT_COUNT_QUEUE } from '@queue/constants';
import { UpdateCommentCountMto } from '@queue/mtos';

import { CommentOwnerType } from '@content/comments/constants';
import { CommentsService } from '@content/comments/comments.service';

import { VideosRepository } from '../videos.repository';

@SqsProcess(UPDATE_VIDEO_COMMENT_COUNT_QUEUE)
export class UpdateVideoCommentCountConsumer {
  constructor(
    @InjectRepository(VideosRepository)
    private readonly videosRepository: VideosRepository,
    private readonly commentsService: CommentsService
  ) {}

  @SqsMessageHandler(true)
  async updateCommentCount(messages: AWS.SQS.Message[]) {
    const mtos: UpdateCommentCountMto[] = messages.map(({ Body }) =>
      JSON.parse(Body)
    );

    const uniqueIds = [...new Set(mtos.map(({ id }) => id))];
    await allSettled(
      uniqueIds.map(
        (id) =>
          new Promise(async (resolve, reject) => {
            try {
              const commentCount = await this.commentsService.reloadCount(
                CommentOwnerType.Look,
                id
              );
              resolve(this.videosRepository.update(id, { commentCount }));
            } catch (err) {
              reject({ id, reason: err });
            }
          })
      )
    );
  }
}
