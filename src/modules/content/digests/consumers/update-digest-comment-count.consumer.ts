import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { allSettled } from '@common/helpers';
import { CommentsRepository } from '@content/comments/comments.repository';
import { CommentOwnerType } from '@content/comments/constants';
import { UPDATE_DIGEST_COMMENT_COUNT_QUEUE } from '@queue/constants';
import { UpdateCommentCountMto } from '@queue/mtos';

import { DigestsRepository } from '../digests.repository';

@SqsProcess(UPDATE_DIGEST_COMMENT_COUNT_QUEUE)
export class UpdateDigestCommentCountConsumer {
  constructor(
    @InjectRepository(DigestsRepository)
    private readonly digestsRepository: DigestsRepository,
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
                  ownerType: CommentOwnerType.Digest,
                  isDeleted: false,
                },
              });
              resolve(this.digestsRepository.update(id, { commentCount }));
            } catch (err) {
              reject({ id, reason: err });
            }
          })
      )
    );
  }
}
