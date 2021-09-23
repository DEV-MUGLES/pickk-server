import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { getRandomUuid } from '@common/helpers';
import {
  REMOVE_LOOK_IMAGES_QUEUE,
  SEND_LOOK_CREATION_SLACK_MESSAGE_QUEUE,
} from '@queue/constants';
import {
  RemoveLookImagesMto,
  SendLookCreationSlackMessageMto,
} from '@queue/mtos';

import { LookImage } from '../models';

@Injectable()
export class LooksProducer {
  constructor(private readonly sqsService: SqsService) {}

  async sendLookCreationSlackMessage(id: number) {
    return await this.sqsService.send<SendLookCreationSlackMessageMto>(
      SEND_LOOK_CREATION_SLACK_MESSAGE_QUEUE,
      {
        id: getRandomUuid(),
        body: {
          id,
        },
      }
    );
  }

  async removeLookImages(images: LookImage[]) {
    if (images.length === 0) {
      return;
    }
    await this.sqsService.send<RemoveLookImagesMto>(REMOVE_LOOK_IMAGES_QUEUE, {
      id: getRandomUuid(),
      body: {
        keys: images.map((v) => v.key),
      },
    });
  }
}
