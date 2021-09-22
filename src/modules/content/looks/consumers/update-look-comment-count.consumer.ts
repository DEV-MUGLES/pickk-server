import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { BaseConsumer } from '@common/base.consumer';
import { UPDATE_LOOK_COMMENT_COUNT_QUEUE } from '@queue/constants';
import { UpdateCommentCountMto } from '@queue/mtos';

import { CommentOwnerType } from '@content/comments/constants';
import { CommentsService } from '@content/comments/comments.service';

import { LooksRepository } from '../looks.repository';

@SqsProcess(UPDATE_LOOK_COMMENT_COUNT_QUEUE)
export class UpdateLookCommentCountConsumer extends BaseConsumer {
  constructor(
    @InjectRepository(LooksRepository)
    private readonly looksRepository: LooksRepository,
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
                CommentOwnerType.LOOK,
                id
              );
              const look = await this.looksRepository.update(id, {
                commentCount,
              });
              resolve(look);
            } catch (error) {
              reject(`lookId: ${id}, UpdateCommentCount Error: ${error}`);
            }
          })
      )
    );
  }
}
