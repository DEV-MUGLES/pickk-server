import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { allSettled } from '@common/helpers';
import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';
import { UPDATE_LOOK_LIKE_COUNT_QUEUE } from '@queue/constants';
import { UpdateLikeCountMto } from '@queue/mtos';

import { LooksRepository } from '../looks.repository';

@SqsProcess(UPDATE_LOOK_LIKE_COUNT_QUEUE)
export class UpdateLookLikeCountConsumer {
  constructor(
    @InjectRepository(LooksRepository)
    private readonly looksRepository: LooksRepository,
    private readonly likesService: LikesService
  ) {}

  @SqsMessageHandler(true)
  async updateLikeCount(messages: AWS.SQS.Message[]) {
    const mtos: UpdateLikeCountMto[] = messages.map(({ Body }) =>
      JSON.parse(Body)
    );

    const uniqueIds = [...new Set(mtos.map(({ id }) => id))];
    await allSettled(
      uniqueIds.map(
        (id) =>
          new Promise(async (resolve, reject) => {
            try {
              const likeCount = await this.likesService.count(
                LikeOwnerType.Look,
                id
              );
              resolve(this.looksRepository.update(id, { likeCount }));
            } catch (err) {
              reject({ id, reason: err });
            }
          })
      )
    );
  }
}
