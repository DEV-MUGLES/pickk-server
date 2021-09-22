import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { BaseConsumer } from '@common/base.consumer';
import { UPDATE_KEYWORD_LIKE_COUNT_QUEUE } from '@queue/constants';
import { UpdateLikeCountMto } from '@queue/mtos';

import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';

import { KeywordsRepository } from '../keywords.repository';

@SqsProcess(UPDATE_KEYWORD_LIKE_COUNT_QUEUE)
export class UpdateKeywordLikeCountConsumer extends BaseConsumer {
  constructor(
    @InjectRepository(KeywordsRepository)
    private readonly keywordsRepository: KeywordsRepository,
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
                LikeOwnerType.KEYWORD,
                id
              );
              const keyword = await this.keywordsRepository.update(id, {
                likeCount,
              });
              resolve(keyword);
            } catch (error) {
              reject(`keywordId: ${id}, UpdateLikeCount Error: ${error}`);
            }
          })
      )
    );
  }
}
