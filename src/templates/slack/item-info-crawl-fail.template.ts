import { IncomingWebhookSendArguments } from '@slack/webhook';

import { SlackChannelName } from '@providers/slack/constants';

export class ItemInfoCrawlFailTemplate {
  static create(url: string, nickname: string): IncomingWebhookSendArguments {
    return {
      channel: SlackChannelName.ItemManagement,
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
