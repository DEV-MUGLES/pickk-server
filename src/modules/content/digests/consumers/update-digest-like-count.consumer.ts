import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';

import { BaseConsumer } from '@common/base.consumer';
import { UPDATE_DIGEST_LIKE_COUNT_QUEUE } from '@queue/constants';
import { UpdateLikeCountMto } from '@queue/mtos';

import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';

import { DigestsRepository } from '../digests.repository';

@SqsProcess(UPDATE_DIGEST_LIKE_COUNT_QUEUE)
export class UpdateDigestLikeCountConsumer extends BaseConsumer {
  constructor(
    @InjectRepository(DigestsRepository)
    private readonly digestsRepository: DigestsRepository,
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
                LikeOwnerType.Digest,
                id
              );
              const digest = await this.digestsRepository.update(id, {
                likeCount,
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
