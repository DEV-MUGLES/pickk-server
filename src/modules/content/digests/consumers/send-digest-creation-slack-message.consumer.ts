import { Logger } from '@nestjs/common';
import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';

import { BaseConsumer } from '@common/base.consumer';
import { SlackService } from '@providers/slack';
import { SEND_DIGEST_CREATION_SLACK_MESSAGE_QUEUE } from '@queue/constants';
import { SendDigestCreationSlackMessageMto } from '@queue/mtos';

import { DigestsService } from '../digests.service';

@SqsProcess(SEND_DIGEST_CREATION_SLACK_MESSAGE_QUEUE)
export class SendDigestCreationSlackMessageConsumer extends BaseConsumer {
  constructor(
    private readonly digestsService: DigestsService,
    private readonly slackService: SlackService,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler()
  async sendSlackMessage(message: AWS.SQS.Message) {
    const { id }: SendDigestCreationSlackMessageMto = JSON.parse(message.Body);
    const digest = await this.digestsService.get(id, ['user']);
    await this.slackService.sendDigestCreation(digest);
  }
}
