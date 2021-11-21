import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';

import { UPDATE_LOOK_LIKE_COUNT_QUEUE } from '@queue/constants';
import { UpdateLikeCountMto } from '@queue/mtos';

import { BaseConsumer } from '@common/base.consumer';
import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';

import { LooksRepository } from '../looks.repository';

@SqsProcess(UPDATE_LOOK_LIKE_COUNT_QUEUE)
export class UpdateLookLikeCountConsumer extends BaseConsumer {
  constructor(
    @InjectRepository(LooksRepository)
    private readonly looksRepository: LooksRepository,
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
                LikeOwnerType.Look,
                id
              );
              const look = await this.looksRepository.update(id, { likeCount });
              resolve(look);
            } catch (error) {
              reject(`lookId: ${id}, UpdateLikeCount Error: ${error}`);
            }
          })
      )
    );
  }
}
