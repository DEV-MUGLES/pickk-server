import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { allSettled } from '@common/helpers';
import { UPDATE_DIGEST_COMMENT_COUNT_QUEUE } from '@queue/constants';
import { UpdateCommentCountMto } from '@queue/mtos';

import { CommentOwnerType } from '@content/comments/constants';
import { CommentsService } from '@content/comments/comments.service';

import { DigestsRepository } from '../digests.repository';

@SqsProcess(UPDATE_DIGEST_COMMENT_COUNT_QUEUE)
export class UpdateDigestCommentCountConsumer {
  constructor(
    @InjectRepository(DigestsRepository)
    private readonly digestsRepository: DigestsRepository,
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
                CommentOwnerType.Digest,
                id
              );
              resolve(this.digestsRepository.update(id, { commentCount }));
            } catch (err) {
              reject({ id, reason: err });
            }
          })
      )
    );
  }
}
