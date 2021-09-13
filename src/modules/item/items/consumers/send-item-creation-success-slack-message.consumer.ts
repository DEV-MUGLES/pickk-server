import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';
import { plainToClass } from 'class-transformer';

import { SlackService } from '@providers/slack';
import { SEND_ITEM_CREATION_SUCCESS_SLACK_MESSAGE_QUEUE } from '@queue/constants';
import { SendItemCreationSuccessSlackMessageMto } from '@queue/mtos';

@SqsProcess(SEND_ITEM_CREATION_SUCCESS_SLACK_MESSAGE_QUEUE)
export class SendItemCreationSuccessSlackMessageConsumer {
  constructor(private readonly slackService: SlackService) {}

  @SqsMessageHandler()
  async sendSlackMessage(message: AWS.SQS.Message) {
    const { item, nickname } = plainToClass(
      SendItemCreationSuccessSlackMessageMto,
      JSON.parse(message.Body)
    );

    await this.slackService.sendItemCreationSuccess(item, nickname);
  }
}
