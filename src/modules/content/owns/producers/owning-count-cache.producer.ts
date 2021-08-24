import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { UPDATE_KEYWORD_CLASS_OWNING_COUNT_CACHE_QUEUE } from '@queue/constants';
import {
  UpdateKeywordClassOwningCountCacheMto,
  UpdateKeywordClassOwningCountCacheType,
} from '@queue/mtos';

@Injectable()
export class OwningCountCacheProducer {
  constructor(private readonly sqsService: SqsService) {}

  private async updateKeywordClassOwningCountCache(
    mto: UpdateKeywordClassOwningCountCacheMto
  ) {
    await this.sqsService.send<UpdateKeywordClassOwningCountCacheMto>(
      UPDATE_KEYWORD_CLASS_OWNING_COUNT_CACHE_QUEUE,
      {
        id: mto.keywordId.toString(),
        body: mto,
      }
    );
  }

  async increaseKeywordClassOwningCountCache(
    mto: Omit<UpdateKeywordClassOwningCountCacheMto, 'type'>
  ) {
    await this.updateKeywordClassOwningCountCache({
      ...mto,
      type: UpdateKeywordClassOwningCountCacheType.Increase,
    });
  }

  async decreaseKeywordClassOwingCountCache(
    mto: Omit<UpdateKeywordClassOwningCountCacheMto, 'type'>
  ) {
    await this.updateKeywordClassOwningCountCache({
      ...mto,
      type: UpdateKeywordClassOwningCountCacheType.Decrease,
    });
  }
}
