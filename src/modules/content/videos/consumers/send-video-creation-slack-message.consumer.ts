import { Logger } from '@nestjs/common';
import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';

import { BaseConsumer } from '@common/base.consumer';
import { SlackService } from '@providers/slack';
import { SEND_VIDEO_CREATION_SLACK_MESSAGE_QUEUE } from '@queue/constants';
import { SendVideoCreationSlackMessageMto } from '@queue/mtos';

import { VideosService } from '../videos.service';

@SqsProcess(SEND_VIDEO_CREATION_SLACK_MESSAGE_QUEUE)
export class SendVideoCreationSlackMessageConsumer extends BaseConsumer {
  constructor(
    private readonly videosService: VideosService,
    private readonly slackService: SlackService,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler()
  async sendSlackMessage(message: AWS.SQS.Message) {
    const { id }: SendVideoCreationSlackMessageMto = JSON.parse(message.Body);
    const video = await this.videosService.get(id, ['user']);
    await this.slackService.sendVideoCreation(video);
  }
}
