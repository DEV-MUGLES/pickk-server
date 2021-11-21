import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';

import { UPDATE_KEYWORD_CLASS_OWNING_COUNT_CACHE_QUEUE } from '@queue/constants';
import { UpdateKeywordClassOwningCountCacheMto } from '@queue/mtos';

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
    const { userId, keywordId }: UpdateKeywordClassOwningCountCacheMto =
      JSON.parse(message.Body);

    const keywordClassIds = await this.keywordsService.getClassIds(keywordId);

    await Promise.all(
      keywordClassIds.map((keywordClassId) =>
        this.ownsService.updateOwningCountCache(userId, keywordClassId)
      )
    );
  }
}
