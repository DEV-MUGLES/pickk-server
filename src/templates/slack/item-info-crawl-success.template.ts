import { IncomingWebhookSendArguments } from '@slack/webhook';
import dayjs from 'dayjs';

import { SlackChannelName } from '@providers/slack/constants';

import { Item } from '@item/items/models';

export class ItemInfoCrawlSuccessTemplate {
  static create(item: Item, nickname: string): IncomingWebhookSendArguments {
    const { id, name, brand, originalPrice, sellPrice, urls } = item;

    return {
      channel: SlackChannelName.ItemManagement,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*👕 새로운 상품이 생성되었습니다.*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*상품명* :\n[${brand.nameKor}] ${name} (id: ${id})`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*originalPrice* :\n${originalPrice}`,
            },
            {
              type: 'mrkdwn',
              text: `*sellPrice* :\n${sellPrice}`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*생성자* :\n${nickname} `,
            },
          ],
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'URL',
              },
              url: urls[0].url,
              style: 'primary',
            },
          ],
        },
        {
          type: 'context',
          elements: [
            {
              type: 'plain_text',
              text: dayjs().format('YYYY. MM. DD. hh:mm:ss'),
            },
          ],
        },
      ],
    };
  }
}
