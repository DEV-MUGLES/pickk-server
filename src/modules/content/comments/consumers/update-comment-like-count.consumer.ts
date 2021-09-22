import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { BaseConsumer } from '@common/base.consumer';
import { UPDATE_COMMENT_LIKE_COUNT_QUEUE } from '@queue/constants';
import { UpdateLikeCountMto } from '@queue/mtos';

import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';

import { CommentsRepository } from '../comments.repository';

@SqsProcess(UPDATE_COMMENT_LIKE_COUNT_QUEUE)
export class UpdateCommentLikeCountConsumer extends BaseConsumer {
  constructor(
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
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
                LikeOwnerType.COMMENT,
                id
              );
              const comment = await this.commentsRepository.update(id, {
                likeCount,
              });
              resolve(comment);
            } catch (error) {
              reject(`commnetId: ${id}, UpdateLikeCount Error: ${error}`);
            }
          })
      )
    );
  }
}
