import { Inject, Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { getRandomUuid } from '@common/helpers';
import {
  REMOVE_DIGEST_IMAGES_QUEUE,
  UPDATE_ITEM_DIGEST_STATISTICS_QUEUE,
} from '@queue/constants';
import {
  RemoveDigestImagesMto,
  UpdateItemDigestStatisticsMto,
} from '@queue/mtos';

@Injectable()
export class DigestsProducer {
  constructor(@Inject(SqsService) private readonly sqsService: SqsService) {}

  async updateItemDigestStatistics(itemIdOrIds: number[] | number) {
    const itemIds = Array.isArray(itemIdOrIds) ? itemIdOrIds : [itemIdOrIds];
    const messages = Array.from(new Set(itemIds)).map((itemId) => ({
      id: getRandomUuid(),
      body: { itemId },
    }));

    await this.sqsService.send<UpdateItemDigestStatisticsMto>(
      UPDATE_ITEM_DIGEST_STATISTICS_QUEUE,
      messages
    );
  }

  async removeDigestImages(keys: string[]) {
    await this.sqsService.send<RemoveDigestImagesMto>(
      REMOVE_DIGEST_IMAGES_QUEUE,
      {
        id: getRandomUuid(),
        body: { keys },
      }
    );
  }
}
