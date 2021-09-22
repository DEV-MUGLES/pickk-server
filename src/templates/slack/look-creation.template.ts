import { IncomingWebhookSendArguments } from '@slack/webhook';
import dayjs from 'dayjs';

import { SlackChannelName } from '@providers/slack/constants';

import { Look } from '@content/looks/models';

import { BaseSlackTemplate } from './base-slack.template';

export class LookCreationTemplate extends BaseSlackTemplate {
  static create(look: Look): IncomingWebhookSendArguments {
    const {
      id,
      user: { email, nickname },
      title,
      createdAt,
    } = look;
    const pickkUrl = `https://pickk.one/looks/${id}`;

    return {
      channel: SlackChannelName.ContentUpload,
      blocks: this.getBlocksBuilder()
        .addText(`:pushpin: *LOOK 등록 알림*`)
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