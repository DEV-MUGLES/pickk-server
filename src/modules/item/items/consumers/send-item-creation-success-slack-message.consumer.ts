import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';
import { plainToClass } from 'class-transformer';

import { SlackService } from '@providers/slack';
import { SEND_ITEM_CREATION_SUCCESS_SLACK_MESSAGE_QUEUE } from '@queue/constants';
import { SendItemCreationSuccessSlackMessageMto } from '@queue/mtos';

import { ItemsService } from '../items.service';

@SqsProcess(SEND_ITEM_CREATION_SUCCESS_SLACK_MESSAGE_QUEUE)
export class SendItemCreationSuccessSlackMessageConsumer {
  constructor(
    private readonly slackService: SlackService,
    private readonly itemsService: ItemsService
  ) {}

  @SqsMessageHandler()
  async sendSlackMessage(message: AWS.SQS.Message) {
    const { id, nickname } = plainToClass(
      SendItemCreationSuccessSlackMessageMto,
      JSON.parse(message.Body)
    );

    const item = await this.itemsService.get(id, ['urls', 'prices', 'brand']);

    await this.slackService.sendItemCreationSuccess(item, nickname);
  }
}
