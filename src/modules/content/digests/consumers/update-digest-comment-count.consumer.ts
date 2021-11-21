import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';

import { BaseConsumer } from '@common/base.consumer';
import { UPDATE_DIGEST_COMMENT_COUNT_QUEUE } from '@queue/constants';
import { UpdateCommentCountMto } from '@queue/mtos';

import { CommentOwnerType } from '@content/comments/constants';
import { CommentsService } from '@content/comments/comments.service';

import { DigestsRepository } from '../digests.repository';

@SqsProcess(UPDATE_DIGEST_COMMENT_COUNT_QUEUE)
export class UpdateDigestCommentCountConsumer extends BaseConsumer {
  constructor(
    @InjectRepository(DigestsRepository)
    private readonly digestsRepository: DigestsRepository,
    private readonly commentsService: CommentsService,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler(true)
  async updateCommentCount(messages: AWS.SQS.Message[]) {
    const mtos: UpdateCommentCountMto[] = messages.map(({ Body }) =>
      JSON.parse(Body)
    );

    const uniqueIds = [...new Set(mtos.map(({ id }) => id))];
    await Promise.all(
      uniqueIds.map(
        (id) =>
          new Promise(async (resolve, reject) => {
            try {
              const commentCount = await this.commentsService.reloadCount(
                CommentOwnerType.Digest,
                id
              );
              const digest = await this.digestsRepository.update(id, {
                commentCount,
              });
              resolve(digest);
            } catch (error) {
              reject(`digestId: ${id}, error: ${error}`);
            }
          })
      )
    );
  }
}
