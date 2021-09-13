import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';
import { plainToClass } from 'class-transformer';

import { SEND_INQUIRY_CREATION_SLACK_MESSAGE_QUEUE } from '@queue/constants';
import { SendInquiryCreationSlackMessageMto } from '@queue/mtos';
import { SlackService } from '@providers/slack';

import { UsersService } from '@user/users/users.service';

@SqsProcess(SEND_INQUIRY_CREATION_SLACK_MESSAGE_QUEUE)
export class SendInquiryCreationSlackMessageConsumer {
  constructor(
    private readonly slackService: SlackService,
    private readonly usersService: UsersService
  ) {}

  @SqsMessageHandler()
  async sendSlackMessage(message: AWS.SQS.Message) {
    const { inquiry } = plainToClass(
      SendInquiryCreationSlackMessageMto,
      JSON.parse(message.Body)
    );
    inquiry.user = await this.usersService.get(inquiry.userId);
    await this.slackService.sendInquiryCreation(inquiry);
  }
}
