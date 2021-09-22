import { IncomingWebhookSendArguments } from '@slack/webhook';

import { SlackChannelName } from '@providers/slack/constants';

import { BaseSlackTemplate } from './base-slack.template';

export class ItemCreationFailTemplate extends BaseSlackTemplate {
  static create(url: string, nickname: string): IncomingWebhookSendArguments {
    return {
      channel: SlackChannelName.ITEM_MANAGEMENT,
      attachments: [
        {
          color: '#f00',
          author_name: '🚨 상품 생성 실패',
          fallback: '🚨 상품 생성 실패',
          text: `URL: ${url}\nUSER: ${nickname}`,
          ts: Date.now().toString(),
        },
      ],
    };
  }
}
