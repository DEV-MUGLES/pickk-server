import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { allSettled } from '@common/helpers';
import { CommentsRepository } from '@content/comments/comments.repository';
import { CommentOwnerType } from '@content/comments/constants';
import { UPDATE_LOOK_COMMENT_COUNT_QUEUE } from '@queue/constants';
import { UpdateCommentCountMto } from '@queue/mtos';

import { LooksRepository } from '../looks.repository';

@SqsProcess(UPDATE_LOOK_COMMENT_COUNT_QUEUE)
export class UpdateLookCommentCountConsumer {
  constructor(
    @InjectRepository(LooksRepository)
    private readonly looksRepository: LooksRepository,
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
                  ownerType: CommentOwnerType.Look,
                  isDeleted: false,
                },
              });
              resolve(this.looksRepository.update(id, { commentCount }));
            } catch (err) {
              reject({ id, reason: err });
            }
          })
      )
    );
  }
}
