import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { getRandomUuid } from '@common/helpers';
import { SEND_LOOK_CREATION_SLACK_MESSAGE_QUEUE } from '@queue/constants';
import { SendLookCreationSlackMessageMto } from '@queue/mtos';

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
}
