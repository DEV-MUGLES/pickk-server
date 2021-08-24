import { getConnection } from 'typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { allSettled } from '@common/helpers';
import { UPDATE_KEYWORD_CLASS_OWNING_COUNT_CACHE_QUEUE } from '@queue/constants';
import {
  UpdateKeywordClassOwningCountCacheMto,
  UpdateKeywordClassOwningCountCacheType,
} from '@queue/mtos';

import { OwnsService } from '../owns.service';

@SqsProcess(UPDATE_KEYWORD_CLASS_OWNING_COUNT_CACHE_QUEUE)
export class UpdateKeywordClassOwningCountCacheConsumer {
  constructor(private readonly ownsService: OwnsService) {}

  @SqsMessageHandler()
  async updateCache(message: AWS.SQS.Message) {
    const mto: UpdateKeywordClassOwningCountCacheMto = JSON.parse(message.Body);
    const KEYWORD_CLASSES_TABLE = 'keyword_classes_keyword_class';

    const keywordClassIds: number[] = (
      await getConnection()
        .createQueryRunner()
        .query(
          `SELECT keywordClassId
          FROM ${KEYWORD_CLASSES_TABLE} 
          WHERE keywordId=${mto.keywordId}`
        )
    ).map(({ keywordClassId }) => keywordClassId);

    const { type, userId } = mto;
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
