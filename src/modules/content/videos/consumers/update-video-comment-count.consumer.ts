import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { allSettled } from '@common/helpers';
import { CommentsRepository } from '@content/comments/comments.repository';
import { CommentOwnerType } from '@content/comments/constants';
import { UPDATE_VIDEO_COMMENT_COUNT_QUEUE } from '@queue/constants';
import { UpdateCommentCountMto } from '@queue/mtos';

import { VideosRepository } from '../videos.repository';

@SqsProcess(UPDATE_VIDEO_COMMENT_COUNT_QUEUE)
export class UpdateVideoCommentCountConsumer {
  constructor(
    @InjectRepository(VideosRepository)
    private readonly videosRepository: VideosRepository,
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository
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
              const commentCount = await this.commentsRepository.count({
                where: {
                  ownerId: id,
                  ownerType: CommentOwnerType.Video,
                  isDeleted: false,
                },
              });
              resolve(this.videosRepository.update(id, { commentCount }));
            } catch (err) {
              reject({ id, reason: err });
            }
          })
      )
    );
  }
}
