import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';
import { plainToClass } from 'class-transformer';

import { SlackService } from '@providers/slack';
import { SEND_ITEM_CREATION_FAIL_SLACK_MESSAGE_QUEUE } from '@queue/constants';
import { SendItemCreationFailSlackMessagMto } from '@queue/mtos';

@SqsProcess(SEND_ITEM_CREATION_FAIL_SLACK_MESSAGE_QUEUE)
export class SendItemCreationFailSlackMessageConsumer {
  constructor(private readonly slackService: SlackService) {}

  @SqsMessageHandler()
  async sendSlackMessage(message: AWS.SQS.Message) {
    const { url, nickname } = plainToClass(
      SendItemCreationFailSlackMessagMto,
      JSON.parse(message.Body)
    );

    await this.slackService.sendItemCreationFail(url, nickname);
  }
}
