import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';
import { plainToClass } from 'class-transformer';

import { SEND_INQUIRY_CREATED_SLACK_MESSAGE_QUEUE } from '@queue/constants';
import { SendInquiryCreatedSlackMessageMto } from '@queue/mtos';
import { SlackService } from '@providers/slack';

import { UsersService } from '@user/users/users.service';

@SqsProcess(SEND_INQUIRY_CREATED_SLACK_MESSAGE_QUEUE)
export class SendInquiryCreationSlackMessageConsumer {
  constructor(
    private readonly slackService: SlackService,
    private readonly usersService: UsersService
  ) {}

  @SqsMessageHandler()
  async sendSlackMessage(message: AWS.SQS.Message) {
    const { inquiry } = plainToClass(
      SendInquiryCreatedSlackMessageMto,
      JSON.parse(message.Body)
    );
    inquiry.user = await this.usersService.get(inquiry.userId);
    await this.slackService.sendInquiryCreation(inquiry);
  }
}
