import { Inject, Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { UPDATE_ITEM_DIGEST_STATISTICS_QUEUE } from '@queue/constants';
import { UpdateItemDigestStatisticsMto } from '@queue/mtos';

@Injectable()
export class DigestsProducer {
  constructor(@Inject(SqsService) private readonly sqsService: SqsService) {}

  async updateItemDigestStatistics(itemIds: number[]) {
    const messages = Array.from(new Set(itemIds)).map((itemId) => ({
      id: itemId.toString(),
      body: { itemId },
    }));

    await this.sqsService.send<UpdateItemDigestStatisticsMto>(
      UPDATE_ITEM_DIGEST_STATISTICS_QUEUE,
      messages
    );
  }
}
