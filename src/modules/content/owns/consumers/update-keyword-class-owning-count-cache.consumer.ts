import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { allSettled } from '@common/helpers';
import { UPDATE_KEYWORD_CLASS_OWNING_COUNT_CACHE_QUEUE } from '@queue/constants';
import {
  UpdateKeywordClassOwningCountCacheMto,
  UpdateKeywordClassOwningCountCacheType,
} from '@queue/mtos';

import { KeywordsService } from '@content/keywords/keywords.service';

import { OwnsService } from '../owns.service';

@SqsProcess(UPDATE_KEYWORD_CLASS_OWNING_COUNT_CACHE_QUEUE)
export class UpdateKeywordClassOwningCountCacheConsumer {
  constructor(
    private readonly ownsService: OwnsService,
    private readonly keywordsService: KeywordsService
  ) {}

  @SqsMessageHandler()
  async updateCache(message: AWS.SQS.Message) {
    const { type, userId, keywordId }: UpdateKeywordClassOwningCountCacheMto =
      JSON.parse(message.Body);

    const keywordClassIds = await this.keywordsService.getClassIds(keywordId);

    await allSettled(
      keywordClassIds.map(
        (keywordClassId) =>
          new Promise(async (resolve, reject) => {
            try {
              if (type === UpdateKeywordClassOwningCountCacheType.Increase) {
                await this.ownsService.increaseOwningCount(
                  userId,
                  keywordClassId
                );
              } else {
                await this.ownsService.decreaseOwningCount(
                  userId,
                  keywordClassId
                );
              }
              resolve(1);
            } catch (err) {
              reject(err);
            }
          })
      )
    );
  }
}
