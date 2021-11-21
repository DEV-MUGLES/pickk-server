import { Logger } from '@nestjs/common';
import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';

import { BaseConsumer } from '@common/base.consumer';
import { SlackService } from '@providers/slack';
import { SEND_LOOK_CREATION_SLACK_MESSAGE_QUEUE } from '@queue/constants';
import { SendLookCreationSlackMessageMto } from '@queue/mtos';

import { LooksService } from '../looks.service';

@SqsProcess(SEND_LOOK_CREATION_SLACK_MESSAGE_QUEUE)
export class SendLookCreationSlackMessageConsumer extends BaseConsumer {
  constructor(
    private readonly looksService: LooksService,
    private readonly slackService: SlackService,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler()
  async sendSlackMessage(message: AWS.SQS.Message) {
    const { id }: SendLookCreationSlackMessageMto = JSON.parse(message.Body);
    const look = await this.looksService.get(id, ['user']);
    await this.slackService.sendLookCreation(look);
  }
}
