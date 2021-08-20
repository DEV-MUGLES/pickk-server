import { InjectRepository } from '@nestjs/typeorm';
import { allSettled } from '@common/helpers';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';
import { UPDATE_DIGEST_LIKE_COUNT_QUEUE } from '@queue/constants';
import { UpdateLikeCountMto } from '@queue/mtos';

import { DigestsRepository } from '../digests.repository';

@SqsProcess(UPDATE_DIGEST_LIKE_COUNT_QUEUE)
export class UpdateDigestLikeCountConsumer {
  constructor(
    @InjectRepository(DigestsRepository)
    private readonly digestsRepository: DigestsRepository,
    private readonly likesService: LikesService
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
              const likeCount = await this.likesService.count(
                LikeOwnerType.Digest,
                id
              );
              resolve(this.digestsRepository.update(id, { likeCount }));
            } catch (err) {
              reject({ id, reason: err });
            }
          })
      )
    );
  }
}
