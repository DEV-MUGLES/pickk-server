import { IncomingWebhookSendArguments } from '@slack/webhook';
import dayjs from 'dayjs';

import { SlackChannelName } from '@providers/slack/constants';

import { Video } from '@content/videos/models';

import { BaseSlackTemplate } from './base-slack.template';

export class VideoCreationTemplate extends BaseSlackTemplate {
  static create(video: Video): IncomingWebhookSendArguments {
    const {
      id,
      user: { email, nickname },
      title,
      createdAt,
    } = video;
    const pickkUrl = `https://pickk.one/videos/${id}`;

    return {
      channel: SlackChannelName.ContentUpload,
      blocks: this.getBlocksBuilder()
        .addText(`:pushpin: *VIDEO 등록 알림*`)
        .addText(`*<${pickkUrl}|${title}>*`)
        .addText(`*작성자*:\n${nickname}(<mailto:${email}|${email}>)`)
        .addText(`*아이템*`)
        .addButtons([{ text: '핔에서 보기', url: pickkUrl, style: 'primary' }])
        .addContext(
          `*<mailto:${email}|${email}(${nickname})>* at ${dayjs(createdAt)
            .format('YYYY. M. D. a H:mm:ss')
            .replace('pm', '오후')
            .replace('am', '오전')}`
        )
        .build(),
    };
  }
}
