import { Inject, Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { getRandomUuid } from '@common/helpers';
import {
  REMOVE_DIGESTS_QUEUE,
  REMOVE_DIGEST_IMAGES_QUEUE,
  SEND_DIGEST_CREATION_SLACK_MESSAGE_QUEUE,
  UPDATE_ITEM_DIGEST_STATISTICS_QUEUE,
} from '@queue/constants';
import {
  RemoveDigestImagesMto,
  SendDigestCreationSlackMessageMto,
  RemoveDigestsMto,
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

  async sendDigestCreationSlackMessage(id: number) {
    await this.sqsService.send<SendDigestCreationSlackMessageMto>(
      SEND_DIGEST_CREATION_SLACK_MESSAGE_QUEUE,
      {
        id: getRandomUuid(),
        body: { id },
      }
    );
  }

  async removeDigests(ids: number[]) {
    await this.sqsService.send<RemoveDigestsMto>(REMOVE_DIGESTS_QUEUE, {
      id: getRandomUuid(),
      body: {
        ids,
      },
    });
  }
}
