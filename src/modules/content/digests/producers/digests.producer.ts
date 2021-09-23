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

import { Digest, DigestImage } from '../models';

@Injectable()
export class DigestsProducer {
  constructor(@Inject(SqsService) private readonly sqsService: SqsService) {}

  async updateItemDigestStatistics(digests: Digest[]) {
    if (digests.length === 0) {
      return;
    }
    const itemIds = digests.map(({ itemId }) => itemId);
    const messages = Array.from(new Set(itemIds)).map((itemId) => ({
      id: getRandomUuid(),
      body: { itemId },
    }));

    await this.sqsService.send<UpdateItemDigestStatisticsMto>(
      UPDATE_ITEM_DIGEST_STATISTICS_QUEUE,
      messages
    );
  }

  async removeDigestImages(images: DigestImage[]) {
    if (images.length === 0) {
      return;
    }
    await this.sqsService.send<RemoveDigestImagesMto>(
      REMOVE_DIGEST_IMAGES_QUEUE,
      {
        id: getRandomUuid(),
        body: { keys: images.map((v) => v.key) },
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

  async removeDigests(digests: Digest[]) {
    if (digests.length === 0) {
      return;
    }
    await this.sqsService.send<RemoveDigestsMto>(REMOVE_DIGESTS_QUEUE, {
      id: getRandomUuid(),
      body: {
        ids: digests.map((v) => v.id),
      },
    });
  }
}
