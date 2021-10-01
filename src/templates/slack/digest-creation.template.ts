import { IncomingWebhookSendArguments } from '@slack/webhook';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { Timezone } from '@common/constants';
import { SlackChannelName } from '@providers/slack/constants';

import { Digest } from '@content/digests/models';

import { BaseSlackTemplate } from './base-slack.template';

dayjs.extend(utc);
dayjs.extend(timezone);

export class DigestCreationTemplate extends BaseSlackTemplate {
  static create(digest: Digest): IncomingWebhookSendArguments {
    const {
      id,
      user: { email, nickname },
      title,
      createdAt,
    } = digest;
    const pickkUrl = `https://pickk.one/digests/${id}`;

    return {
      channel: SlackChannelName.ContentUpload,
      blocks: this.getBlocksBuilder()
        .addText(`:pushpin: *꿀템 등록 알림*`)
        .addText(`*<${pickkUrl}|${title}>*`)
        .addText(`*작성자*:\n${nickname}(<mailto:${email}|${email}>)`)
        .addText(`*아이템*`)
        .addButtons([{ text: '핔에서 보기', url: pickkUrl, style: 'primary' }])
        .addContext(
          `*<mailto:${email}|${email}(${nickname})>* at ${dayjs
            .tz(createdAt, Timezone.Seoul)
            .format('YYYY. M. D. a H:mm:ss')
            .replace('pm', '오후')
            .replace('am', '오전')}`
        )
        .build(),
    };
  }
}
