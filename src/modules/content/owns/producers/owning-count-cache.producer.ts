import { Injectable } from '@nestjs/common';
import { SqsService } from '@nestjs-packages/sqs';

import { getRandomUuid } from '@common/helpers';
import { UPDATE_KEYWORD_CLASS_OWNING_COUNT_CACHE_QUEUE } from '@queue/constants';
import { UpdateKeywordClassOwningCountCacheMto } from '@queue/mtos';

@Injectable()
export class OwningCountCacheProducer {
  constructor(private readonly sqsService: SqsService) {}

  async updateKeywordClassOwningCountCache(
    mto: UpdateKeywordClassOwningCountCacheMto
  ) {
    await this.sqsService.send<UpdateKeywordClassOwningCountCacheMto>(
      UPDATE_KEYWORD_CLASS_OWNING_COUNT_CACHE_QUEUE,
      {
        id: getRandomUuid(),
        body: mto,
      }
    );
  }
}
