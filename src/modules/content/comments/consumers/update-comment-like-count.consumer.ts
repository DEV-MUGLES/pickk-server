import { allSettled } from '@common/helpers';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';
import { UPDATE_COMMENT_LIKE_COUNT_QUEUE } from '@queue/constants';
import { UpdateLikeCountMto } from '@queue/mtos';

import { CommentsService } from '../comments.service';

@SqsProcess(UPDATE_COMMENT_LIKE_COUNT_QUEUE)
export class UpdateCommentLikeCountConsumer {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly likesSerivce: LikesService
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
              const likeCount = await this.likesSerivce.count(
                LikeOwnerType.Comment,
                id
              );
              resolve(this.commentsService.update(id, { likeCount }));
            } catch (err) {
              reject({ id, reason: err });
            }
          })
      )
    );
  }
}
